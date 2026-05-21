<script lang="ts">
	import { geoMercator, geoPath } from 'd3-geo';
	import { feature } from 'topojson-client';
	import topo from 'world-atlas/countries-110m.json';
	import { UV_VOTE_COLORS, resolveName, type Resolution, type VoteValue } from './mockData';

	let { resolution }: { resolution: Resolution } = $props();

	const VIEW_W = 900;
	const VIEW_H = 500;
	const MIN_K = 1;
	const MAX_K = 20;

	const VOTE_LABEL: Record<VoteValue, string> = {
		yes: 'In favour',
		no: 'Against',
		abstain: 'Abstain',
		'not-voting': 'No vote recorded'
	};

	interface WorldPath {
		id: string;
		name: string;
		d: string;
	}

	function buildPaths(): WorldPath[] {
		const geo = feature(topo as any, (topo as any).objects.countries) as any;
		// ISO numeric 010 == Antarctica in world-atlas; exclude it.
		const features = geo.features.filter((f: any) => String(f.id) !== '010');
		const fc = { type: 'FeatureCollection', features };
		const projection = geoMercator()
			.rotate([-10, 0])
			.fitExtent(
				[
					[8, 8],
					[VIEW_W - 8, VIEW_H - 8]
				],
				fc as any
			);
		const pathGen = geoPath(projection);
		return features.map((f: any) => ({
			id: f.id != null ? String(f.id) : '',
			name: (f.properties && (f.properties.name || f.properties.NAME)) || 'Unknown',
			d: pathGen(f) || ''
		}));
	}

	const paths: WorldPath[] = buildPaths();

	const lookup = $derived.by(() => {
		const m: Record<string, VoteValue> = {};
		for (const [k, v] of Object.entries(resolution.votes || {})) {
			m[resolveName(k)] = v;
		}
		return m;
	});

	function fillRule(name: string): VoteValue {
		const explicit = lookup[name];
		if (explicit) return explicit;
		if (
			resolution.body === 'GA' &&
			resolution.result === 'Adopted' &&
			resolution.summary.yes > resolution.summary.no + resolution.summary.abstain
		) {
			return 'yes';
		}
		return 'not-voting';
	}

	let svgEl = $state<SVGSVGElement | null>(null);
	let k = $state(1);
	let tx = $state(0);
	let ty = $state(0);

	let panning = $state(false);
	let panStart = { x: 0, y: 0, tx: 0, ty: 0 };

	type Tip = { x: number; y: number; name: string; vote: string; recorded: boolean };
	let tip = $state<Tip | null>(null);

	function svgPoint(clientX: number, clientY: number): { x: number; y: number } {
		if (!svgEl) return { x: 0, y: 0 };
		const rect = svgEl.getBoundingClientRect();
		return {
			x: ((clientX - rect.left) / rect.width) * VIEW_W,
			y: ((clientY - rect.top) / rect.height) * VIEW_H
		};
	}

	function clamp(v: number, min: number, max: number) {
		return Math.max(min, Math.min(max, v));
	}

	function clampPan(nextK: number, nx: number, ny: number) {
		// Keep the map roughly within the viewport.
		const minX = VIEW_W - VIEW_W * nextK;
		const minY = VIEW_H - VIEW_H * nextK;
		return {
			tx: clamp(nx, minX, 0),
			ty: clamp(ny, minY, 0)
		};
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		const { x, y } = svgPoint(e.clientX, e.clientY);
		const factor = Math.exp(-e.deltaY * 0.0015);
		const nextK = clamp(k * factor, MIN_K, MAX_K);
		if (nextK === k) return;
		// Zoom centered on the cursor: keep (x, y) fixed under the cursor.
		const nx = x - ((x - tx) * nextK) / k;
		const ny = y - ((y - ty) * nextK) / k;
		const clamped = clampPan(nextK, nx, ny);
		k = nextK;
		tx = clamped.tx;
		ty = clamped.ty;
	}

	function onPointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		panning = true;
		panStart = { x: e.clientX, y: e.clientY, tx, ty };
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!panning || !svgEl) return;
		const rect = svgEl.getBoundingClientRect();
		const dx = ((e.clientX - panStart.x) / rect.width) * VIEW_W;
		const dy = ((e.clientY - panStart.y) / rect.height) * VIEW_H;
		const clamped = clampPan(k, panStart.tx + dx, panStart.ty + dy);
		tx = clamped.tx;
		ty = clamped.ty;
	}

	function onPointerUp(e: PointerEvent) {
		panning = false;
		try {
			(e.currentTarget as Element).releasePointerCapture(e.pointerId);
		} catch {}
	}

	function onPathEnter(e: PointerEvent, p: WorldPath) {
		const explicit = lookup[p.name];
		const v: VoteValue = explicit ?? 'not-voting';
		tip = {
			x: e.clientX,
			y: e.clientY,
			name: p.name,
			vote: explicit ? VOTE_LABEL[v] : 'Not recorded',
			recorded: !!explicit
		};
	}

	function onPathMove(e: PointerEvent) {
		if (!tip) return;
		tip = { ...tip, x: e.clientX, y: e.clientY };
	}

	function onPathLeave() {
		tip = null;
	}

	function reset() {
		k = 1;
		tx = 0;
		ty = 0;
	}
</script>

<div class="map">
	<div class="map-head">
		<div class="map-title">Geographic breakdown</div>
		<button
			type="button"
			class="reset"
			onclick={reset}
			disabled={k === 1 && tx === 0 && ty === 0}>Reset view</button
		>
	</div>
	<div class="stage">
		<svg
			bind:this={svgEl}
			viewBox="0 0 {VIEW_W} {VIEW_H}"
			preserveAspectRatio="xMidYMid meet"
			class:panning
			onwheel={onWheel}
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
			role="img"
			aria-label="World map of votes"
		>
			<g transform="translate({tx} {ty}) scale({k})" stroke="#ffffff" stroke-width={0.4 / k}>
				{#each paths as p, i (i)}
					<path
						d={p.d}
						fill={UV_VOTE_COLORS[fillRule(p.name)]}
						role="img"
						aria-label={p.name}
						onpointerenter={(e) => onPathEnter(e, p)}
						onpointermove={onPathMove}
						onpointerleave={onPathLeave}
					/>
				{/each}
			</g>
		</svg>
		{#if tip}
			<div
				class="tooltip"
				style:left="{tip.x}px"
				style:top="{tip.y}px"
				class:not-recorded={!tip.recorded}
			>
				<div class="tip-name">{tip.name}</div>
				<div class="tip-vote">{tip.vote}</div>
			</div>
		{/if}
	</div>
	<div class="legend">
		<span><span class="sw" style:background={UV_VOTE_COLORS.yes}></span>In favour</span>
		<span><span class="sw" style:background={UV_VOTE_COLORS.no}></span>Against</span>
		<span><span class="sw" style:background={UV_VOTE_COLORS.abstain}></span>Abstain</span>
		<span
			><span class="sw" style:background={UV_VOTE_COLORS['not-voting']} style:border="1px solid #d4d4d4"
			></span>Absent</span
		>
		<span class="hint">Scroll to zoom · drag to pan</span>
	</div>
</div>

<style>
	.map {
		border: 1px solid var(--border);
		background: var(--bg-subtle);
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-height: 320px;
	}
	.map-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}
	.map-title {
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--fg-3);
	}
	.reset {
		font: inherit;
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-2);
		background: transparent;
		border: 1px solid var(--border);
		padding: 4px 8px;
		cursor: pointer;
	}
	.reset:hover:not(:disabled) {
		color: var(--fg-1);
		border-color: var(--fg-3);
	}
	.reset:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.stage {
		position: relative;
	}
	svg {
		width: 100%;
		display: block;
		cursor: grab;
		touch-action: none;
		user-select: none;
	}
	svg.panning {
		cursor: grabbing;
	}
	svg path {
		transition: filter 0.08s ease;
	}
	svg path:hover {
		filter: brightness(0.85);
	}
	.tooltip {
		position: fixed;
		transform: translate(12px, 12px);
		pointer-events: none;
		background: #111;
		color: #fff;
		font-family: var(--font-mono);
		font-size: 11px;
		padding: 6px 8px;
		border: 1px solid #000;
		z-index: 10;
		max-width: 240px;
		line-height: 1.35;
	}
	.tip-name {
		letter-spacing: 0.04em;
	}
	.tip-vote {
		color: #d4d4d4;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-top: 2px;
	}
	.tooltip.not-recorded .tip-vote {
		color: #888;
	}
	.legend {
		display: flex;
		gap: 14px;
		font-size: 10px;
		color: var(--fg-3);
		letter-spacing: 0.04em;
		flex-wrap: wrap;
		align-items: center;
	}
	.legend .sw {
		display: inline-block;
		width: 8px;
		height: 8px;
		margin-right: 6px;
	}
	.legend .hint {
		margin-left: auto;
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.7;
	}
</style>
