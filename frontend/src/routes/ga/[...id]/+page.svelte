<script lang="ts">
	import MiniMap from '$lib/MiniMap.svelte';
	import type { VoteValue } from '$lib/mockData';

	let { data } = $props();
	const r = $derived(data.resolution);

	const isConsensus = $derived(r.summary.yes === 0 && r.summary.no === 0 && r.summary.abstain === 0);

	// Calculate Roll Call
	const rollCall = $derived.by(() => {
		const list: { name: string; vote: VoteValue }[] = [];
		for (const [name, vote] of Object.entries(r.votes || {})) {
			list.push({ name, vote });
		}
		list.sort((a, b) => a.name.localeCompare(b.name));
		return list;
	});

	const notVoting = $derived(rollCall.filter((c) => c.vote === 'not-voting').length);
</script>

<header class="un-header">
	<div class="un-header-inner">
		<a href="/" class="un-wordmark">UN VOTES</a>
		<nav class="un-nav">
			<a href="/ga" class="active">General Assembly</a>
			<span class="sep">·</span>
			<a href="/sc">Security Council</a>
			<span class="sep">·</span>
			<a href="/about">About</a>
		</nav>
	</div>
</header>

<main class="page-wrap fade-in">
	<div class="back-link">
		<a href="/ga">← Back to General Assembly</a>
	</div>

	<div class="res-eyebrow">
		<span>General Assembly</span>
		<span class="sep">·</span>
		<span>Session {r.session}</span>
		{#if r.result}
			<span class="sep">·</span>
			<span class="badge adopted">{isConsensus ? 'Consensus' : r.result}</span>
		{/if}
	</div>

	<h1 class="res-title">{r.title}</h1>
	
	<div class="res-meta">
		<div class="m-item">
			<div class="lbl">Resolution ID</div>
			<div class="val id">{r.id}</div>
		</div>
		<div class="m-item">
			<div class="lbl">Date</div>
			<div class="val">{r.date}</div>
		</div>
		{#if r.subjects}
		<div class="m-item">
			<div class="lbl">Subjects</div>
			<div class="val tags">
				{#each r.subjects.split(',').map((s: string) => s.trim()).filter((s: string) => s) as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		</div>
		{/if}
	</div>

	{#if !isConsensus}
	<div class="tally-box">
		<div class="t yes">
			<div class="num">{r.summary.yes}</div>
			<div class="lbl">In favour</div>
		</div>
		<div class="t no">
			<div class="num">{r.summary.no}</div>
			<div class="lbl">Against</div>
		</div>
		<div class="t abs">
			<div class="num">{r.summary.abstain}</div>
			<div class="lbl">Abstain</div>
		</div>
		<div class="t nv">
			<div class="num">{notVoting}</div>
			<div class="lbl">Absent / Not Voting</div>
		</div>
	</div>
	{:else}
	<div class="tally-box consensus-box">
		<div class="num">Adopted without a vote</div>
		<div class="lbl">Consensus</div>
	</div>
	{/if}

	<div class="map-container">
		<MiniMap resolution={r} />
	</div>

	{#if !isConsensus}
	<div class="roll-call">
		<h2>Roll Call Vote</h2>
		<div class="rc-grid">
			{#each rollCall as item}
				<div class="rc-row">
					<div class="c-name">{item.name}</div>
					<div class="c-vote v-{item.vote}">{item.vote.replace('-', ' ')}</div>
				</div>
			{/each}
		</div>
	</div>
	{/if}
</main>

<style>
	.un-header {
		border-bottom: 1px solid var(--border);
		padding: 18px 0;
		background: var(--bg);
	}
	.un-header-inner {
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 24px;
		display: flex;
		align-items: center;
		gap: 24px;
	}
	.un-wordmark {
		font-size: var(--fs-xs);
		font-weight: var(--fw-bold);
		letter-spacing: 0.18em;
		color: var(--fg-strong);
		text-decoration: none;
	}
	.un-nav {
		display: flex;
		gap: 22px;
		margin-left: 28px;
		font-size: var(--fs-xs);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
	}
	.un-nav a {
		color: var(--fg-3);
		text-decoration: none;
	}
	.un-nav a.active {
		color: var(--fg-strong);
		font-weight: var(--fw-semibold);
	}
	.un-nav .sep {
		color: var(--gray-200);
	}

	.page-wrap {
		max-width: 900px;
		margin: 0 auto;
		padding: 32px 24px 80px;
	}
	.back-link {
		margin-bottom: 32px;
	}
	.back-link a {
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		color: var(--fg-3);
		text-decoration: none;
		transition: color var(--dur) var(--ease);
	}
	.back-link a:hover {
		color: var(--fg-strong);
	}

	.res-eyebrow {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		color: var(--fg-3);
		margin-bottom: 16px;
	}
	.res-eyebrow .sep {
		color: var(--gray-300);
	}
	
	.badge {
		display: inline-block;
		font-size: 10px;
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		font-weight: var(--fw-semibold);
		padding: 3px 7px;
		border-radius: var(--radius-1);
		border: 1px solid var(--border);
		background: var(--bg);
		color: var(--fg-2);
	}
	.badge.adopted {
		color: var(--vote-yes);
		border-color: var(--vote-yes);
		background: var(--vote-yes-bg);
	}

	.res-title {
		font-size: clamp(28px, 4vw, 44px);
		font-weight: var(--fw-bold);
		letter-spacing: -0.02em;
		line-height: 1.1;
		color: var(--fg-strong);
		margin: 0 0 32px 0;
		text-wrap: balance;
	}

	.res-meta {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 24px;
		padding-bottom: 32px;
		border-bottom: 1px solid var(--border);
		margin-bottom: 32px;
	}
	.m-item .lbl {
		font-size: 10px;
		font-weight: var(--fw-semibold);
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		color: var(--fg-3);
		margin-bottom: 8px;
	}
	.m-item .val {
		font-size: var(--fs-sm);
		color: var(--fg-strong);
		line-height: 1.4;
	}
	.m-item .id {
		font-family: var(--font-mono);
		font-weight: var(--fw-medium);
	}
	.tag {
		display: inline-block;
		font-size: 10px;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		padding: 3px 8px;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		color: var(--fg-2);
		margin: 0 6px 6px 0;
	}

	.tally-box {
		display: flex;
		border: 1px solid var(--border);
		border-radius: var(--radius-3);
		overflow: hidden;
		margin-bottom: 40px;
	}
	.tally-box .t {
		flex: 1;
		padding: 24px;
		border-right: 1px solid var(--border);
		text-align: center;
		background: var(--bg);
	}
	.tally-box .t:last-child {
		border-right: 0;
	}
	.tally-box .num {
		font-size: clamp(32px, 4vw, 48px);
		font-weight: var(--fw-bold);
		line-height: 1;
		font-variant-numeric: tabular-nums;
		margin-bottom: 8px;
	}
	.tally-box .lbl {
		font-size: 11px;
		font-weight: var(--fw-semibold);
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		color: var(--fg-3);
	}
	.t.yes .num { color: var(--vote-yes); }
	.t.no .num { color: var(--vote-no); }
	.t.abs .num { color: var(--vote-abstain); }
	.t.nv .num { color: var(--fg-3); }

	.consensus-box {
		flex-direction: column;
		align-items: center;
		padding: 32px;
		background: var(--bg-subtle);
	}
	.consensus-box .num {
		font-size: clamp(24px, 3vw, 32px);
		color: var(--fg-strong);
	}

	.map-container {
		margin: 0 -24px 64px;
		background: var(--bg-subtle);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		padding: 24px 0;
	}

	.roll-call {
		margin-top: 48px;
	}
	.roll-call h2 {
		font-size: var(--fs-xl);
		font-weight: var(--fw-bold);
		letter-spacing: var(--tracking-tight);
		color: var(--fg-strong);
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--border-strong);
	}
	.rc-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		column-gap: 48px;
		row-gap: 8px;
	}
	.rc-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		border-bottom: 1px solid var(--border-muted);
		font-size: var(--fs-sm);
	}
	.rc-row:hover {
		background: var(--bg-subtle);
	}
	.c-name {
		color: var(--fg);
		font-weight: var(--fw-medium);
	}
	.c-vote {
		font-size: 10px;
		font-weight: var(--fw-bold);
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
	}
	:global(.v-yes) { color: var(--vote-yes); }
	:global(.v-no) { color: var(--vote-no); }
	:global(.v-abstain) { color: var(--vote-abstain); }
	:global(.v-not-voting) { color: var(--fg-4); }

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	.fade-in {
		animation: fade-in 360ms var(--ease) both;
	}
</style>
