<script lang="ts">
	import { onMount } from 'svelte';
	import { UV_VOTE_COLORS, resolveName, type Resolution, type VoteValue } from './mockData';

	let { resolution }: { resolution: Resolution } = $props();

	interface WorldPath {
		id: string;
		name: string;
		d: string;
	}

	let paths = $state<WorldPath[] | null>(null);
	let failed = $state(false);

	onMount(async () => {
		try {
			const [{ geoMercator, geoPath }, topojsonClient, topo] = await Promise.all([
				import('https://esm.sh/d3-geo@3' as string),
				import('https://esm.sh/topojson-client@3' as string),
				fetch('https://unpkg.com/world-atlas@2/countries-110m.json').then((r) => r.json())
			]);
			const geo = topojsonClient.feature(topo, topo.objects.countries);
			const projection = geoMercator().scale(140).translate([450, 300]).center([0, 30]);
			const pathGen = geoPath(projection);
			paths = geo.features.map((f: any) => ({
				id: String(f.id).padStart(3, '0'),
				name: (f.properties && (f.properties.name || f.properties.NAME)) || 'Unknown',
				d: pathGen(f) || ''
			}));
		} catch {
			failed = true;
		}
	});

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
</script>

<div class="map">
	<div class="map-title">Geographic breakdown</div>
	{#if paths}
		<svg viewBox="0 0 900 500" preserveAspectRatio="xMidYMid meet">
			<g stroke="#ffffff" stroke-width="0.4">
				{#each paths as p (p.id)}
					<path d={p.d} fill={UV_VOTE_COLORS[fillRule(p.name)]} />
				{/each}
			</g>
		</svg>
	{:else}
		<div class="loading">{failed ? 'Map unavailable' : 'Loading topology…'}</div>
	{/if}
	<div class="legend">
		<span><span class="sw" style:background={UV_VOTE_COLORS.yes}></span>In favour</span>
		<span><span class="sw" style:background={UV_VOTE_COLORS.no}></span>Against</span>
		<span><span class="sw" style:background={UV_VOTE_COLORS.abstain}></span>Abstain</span>
		<span
			><span class="sw" style:background={UV_VOTE_COLORS['not-voting']} style:border="1px solid #d4d4d4"
			></span>Absent</span
		>
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
	.map-title {
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--fg-3);
	}
	svg {
		width: 100%;
		display: block;
	}
	.loading {
		height: 220px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--fg-3);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.legend {
		display: flex;
		gap: 14px;
		font-size: 10px;
		color: var(--fg-3);
		letter-spacing: 0.04em;
		flex-wrap: wrap;
	}
	.legend .sw {
		display: inline-block;
		width: 8px;
		height: 8px;
		margin-right: 6px;
	}
</style>
