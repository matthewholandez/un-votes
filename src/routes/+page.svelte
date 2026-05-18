<script lang="ts">
	import MiniMap from '$lib/MiniMap.svelte';
	import { UV_RESOLUTIONS, UV_SUMMARY } from '$lib/mockData';

	const featured = UV_RESOLUTIONS.SC[1];
	const totalGA = UV_SUMMARY.GA.total;
	const totalSC = UV_SUMMARY.SC.total;
</script>

<header class="site-header">
	<div class="page-wrap bar">
		<a class="site-logo" href="/">UN&nbsp;VOTES</a>
		<nav class="nav-links">
			<a class="nav-link is-active" href="/">Home</a>
			<a class="nav-link" href="/ga">General Assembly</a>
			<a class="nav-link" href="/sc">Security Council</a>
			<a class="nav-link" href="/about">About</a>
		</nav>
	</div>
</header>

<main class="page-wrap home fade-in">
	<section class="home-hero">
		<div class="home-eyebrow">United Nations · Voting Records</div>
		<h1 class="home-display">
			Every <span class="underline">vote</span>,<br />
			every <span class="underline">veto</span>,<br />
			since <span>1946</span>.
		</h1>
		<p class="home-deck">
			A continuously updated record of how every member state has voted in the
			<strong>General&nbsp;Assembly</strong> and the <strong>Security&nbsp;Council</strong>. Sourced
			from the UN Digital Library, refreshed weekly.
		</p>
	</section>

	<div class="section-mark">
		<span class="num">01</span>
		<span class="label">By the numbers</span>
		<span class="spacer"></span>
		<span class="meta">Current session</span>
	</div>
	<div class="by-numbers">
		<div class="col">
			<div class="label">Resolutions tracked</div>
			<div class="figure">{(totalGA + totalSC).toLocaleString()}</div>
			<div class="sub">GA + SC · 79th session</div>
		</div>
		<div class="col">
			<div class="label">Adopted</div>
			<div class="figure yes">
				{(UV_SUMMARY.GA.adopted + UV_SUMMARY.SC.adopted).toLocaleString()}
			</div>
			<div class="sub">Passed at least one threshold</div>
		</div>
		<div class="col">
			<div class="label">Vetoed</div>
			<div class="figure no">{UV_SUMMARY.SC.vetoed}</div>
			<div class="sub">SC only · by permanent members</div>
		</div>
		<div class="col">
			<div class="label">Member states</div>
			<div class="figure">193</div>
			<div class="sub">Eligible to vote in the GA</div>
		</div>
	</div>

	<div class="section-mark">
		<span class="num">02</span>
		<span class="label">Most recent · Security Council</span>
		<span class="spacer"></span>
		<span class="meta">{featured.date}</span>
	</div>
	<div class="featured">
		<div class="body">
			<div class="eyebrow">Security Council · Vetoed</div>
			<div class="res-id">{featured.id}</div>
			<h2>{featured.title}</h2>
			<div class="meta-row">
				<span><strong>Body</strong> · Security Council</span>
				<span><strong>Date</strong> · {featured.date}</span>
				<span><strong>Session</strong> · {featured.session}</span>
			</div>
			<div class="tally">
				<div class="t">
					<div class="lbl">In favour</div>
					<div class="num yes">{featured.summary.yes}</div>
				</div>
				<div class="t">
					<div class="lbl">Against</div>
					<div class="num no">{featured.summary.no}</div>
				</div>
				<div class="t">
					<div class="lbl">Abstain</div>
					<div class="num abs">{featured.summary.abstain}</div>
				</div>
			</div>
			<button class="btn btn-outline" type="button">View full map →</button>
		</div>
		<MiniMap resolution={featured} />
	</div>

	<div class="section-mark">
		<span class="num">03</span>
		<span class="label">Browse by body</span>
	</div>
	<div class="bodies">
		<a href="/ga" class="body-link">
			<span class="num">A · 193 MEMBERS</span>
			<h3>General<br />Assembly</h3>
			<p class="desc">
				Every member state votes. Resolutions are non-binding but carry the weight of broad
				international consensus.
			</p>
			<span class="open">Open voting records <span class="arrow">→</span></span>
		</a>
		<a href="/sc" class="body-link">
			<span class="num">B · 15 MEMBERS</span>
			<h3>Security<br />Council</h3>
			<p class="desc">
				Ten elected, five permanent. The P5 hold the veto — a single "no" from any of them blocks a
				resolution.
			</p>
			<span class="open">Open voting records <span class="arrow">→</span></span>
		</a>
	</div>
</main>

<footer class="site-footer">
	<div class="page-wrap row">
		<span>UN Votes · Data from the UN Digital Library</span>
		<span><a href="/about">About</a> · <a href="/about#methodology">Methodology</a></span>
	</div>
</footer>

<style>
	:global(.page-wrap) {
		width: var(--measure-wide);
		margin-inline: auto;
	}

	.site-header {
		position: sticky;
		top: 0;
		z-index: 20;
		border-bottom: 1px solid var(--gray-950);
		background: color-mix(in oklab, #ffffff 92%, transparent);
		backdrop-filter: blur(8px);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 32px;
		padding: 18px 0 14px;
	}
	.site-logo {
		font-size: 16px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--fg-strong);
		white-space: nowrap;
	}
	.nav-links {
		display: flex;
		gap: 28px;
		margin-left: auto;
	}
	.nav-link {
		font-size: 12px;
		font-weight: 500;
		color: var(--fg-3);
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		white-space: nowrap;
		transition: color var(--dur) var(--ease);
		position: relative;
	}
	.nav-link:hover,
	.nav-link.is-active {
		color: var(--fg-strong);
	}
	.nav-link.is-active::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -19px;
		height: 2px;
		background: var(--fg-strong);
	}

	.site-footer {
		border-top: 1px solid var(--border);
		padding: 32px 0;
		margin-top: 120px;
		color: var(--fg-3);
		font-size: 11px;
		letter-spacing: 0.06em;
	}
	.site-footer .row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.site-footer .row :global(a) {
		color: var(--fg-2);
		text-decoration-color: var(--border-strong);
	}

	.section-mark {
		display: flex;
		align-items: baseline;
		gap: 14px;
		border-top: 1px solid var(--gray-950);
		padding-top: 14px;
		margin: 56px 0 28px;
	}
	.section-mark .num {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.18em;
		color: var(--fg-strong);
	}
	.section-mark .label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--fg-3);
	}
	.section-mark .spacer {
		flex: 1;
	}
	.section-mark .meta {
		font-size: 11px;
		letter-spacing: 0.04em;
		color: var(--fg-3);
	}

	.home {
		padding: 56px 0 32px;
	}
	.home-hero {
		padding-bottom: 56px;
		border-bottom: 1px solid var(--gray-950);
	}
	.home-eyebrow {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--fg-3);
		margin: 0 0 28px 0;
		display: inline-block;
		padding-left: 14px;
		position: relative;
	}
	.home-eyebrow::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 8px;
		height: 1px;
		background: var(--fg-strong);
	}
	.home-display {
		font-size: clamp(3rem, 9.5vw, 7.4rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 0.94;
		margin: 0 0 28px 0;
		color: var(--fg-strong);
	}
	.home-display .underline {
		position: relative;
		display: inline-block;
	}
	.home-display .underline::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0.12em;
		bottom: 0.08em;
		height: 2px;
		background: var(--fg-strong);
	}
	.home-deck {
		font-size: clamp(15px, 1.6vw, 18px);
		color: var(--fg-2);
		margin: 0 0 36px 0;
		max-width: 640px;
		line-height: 1.55;
		font-weight: 400;
	}
	.home-deck strong {
		color: var(--fg-strong);
		font-weight: 600;
	}

	.by-numbers {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0;
		border-top: 1px solid var(--gray-950);
		border-bottom: 1px solid var(--gray-950);
	}
	.by-numbers .col {
		padding: 22px 20px 22px 0;
		border-right: 1px solid var(--border);
	}
	.by-numbers .col:last-child {
		border-right: 0;
		padding-right: 0;
	}
	.by-numbers .col:not(:first-child) {
		padding-left: 24px;
	}
	.by-numbers .label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--fg-3);
		margin-bottom: 12px;
	}
	.by-numbers .figure {
		font-size: clamp(36px, 4.6vw, 56px);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.by-numbers .figure.yes {
		color: var(--vote-yes);
	}
	.by-numbers .figure.no {
		color: var(--vote-no);
	}
	.by-numbers .sub {
		font-size: 11px;
		color: var(--fg-3);
		margin-top: 8px;
		letter-spacing: 0.02em;
	}

	.featured {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 48px;
		align-items: stretch;
	}
	.featured .body {
		padding: 8px 0;
	}
	.featured .eyebrow {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--fg-3);
		margin: 0 0 14px 0;
	}
	.featured .res-id {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--fg-strong);
		margin-bottom: 14px;
	}
	.featured h2 {
		font-size: clamp(22px, 2.4vw, 32px);
		font-weight: 700;
		line-height: 1.18;
		letter-spacing: -0.01em;
		margin: 0 0 18px 0;
		text-wrap: balance;
	}
	.featured .meta-row {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
		font-size: 12px;
		color: var(--fg-3);
		margin-bottom: 22px;
	}
	.featured .meta-row strong {
		color: var(--fg-strong);
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	.featured .tally {
		display: flex;
		gap: 0;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		margin-bottom: 22px;
	}
	.featured .tally .t {
		flex: 1;
		padding: 14px 16px;
		border-right: 1px solid var(--border);
	}
	.featured .tally .t:last-child {
		border-right: 0;
	}
	.featured .tally .lbl {
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-3);
		margin-bottom: 6px;
	}
	.featured .tally .num {
		font-size: 28px;
		font-weight: 700;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.featured .tally .num.yes {
		color: var(--vote-yes);
	}
	.featured .tally .num.no {
		color: var(--vote-no);
	}
	.featured .tally .num.abs {
		color: var(--vote-abstain);
	}

	.btn {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		padding: 8px 14px;
		border-radius: 2px;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all var(--dur) var(--ease);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.btn-outline {
		background: transparent;
		color: var(--fg-strong);
		border-color: var(--gray-950);
	}
	.btn-outline:hover {
		background: var(--fg-strong);
		color: var(--fg-on-dark);
	}

	.bodies {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		border-top: 1px solid var(--gray-950);
		border-bottom: 1px solid var(--gray-950);
	}
	.body-link {
		padding: 28px 28px 32px 0;
		border-right: 1px solid var(--border);
		text-decoration: none;
		color: var(--fg);
		display: flex;
		flex-direction: column;
		gap: 6px;
		transition: background var(--dur) var(--ease);
	}
	.body-link:nth-child(2) {
		padding-left: 32px;
		border-right: 0;
		padding-right: 0;
	}
	.body-link:hover {
		background: var(--bg-subtle);
	}
	.body-link .num {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.18em;
		color: var(--fg-3);
	}
	.body-link h3 {
		font-size: clamp(28px, 3.4vw, 44px);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.04;
		margin: 8px 0 6px 0;
	}
	.body-link .desc {
		font-size: 13px;
		color: var(--fg-2);
		max-width: 38ch;
		margin: 6px 0 18px;
	}
	.body-link .open {
		margin-top: auto;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-strong);
	}
	.body-link .open .arrow {
		display: inline-block;
		margin-left: 6px;
		transition: transform var(--dur) var(--ease);
	}
	.body-link:hover .open .arrow {
		transform: translateX(4px);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.fade-in {
		animation: fade-in 360ms var(--ease) both;
	}
</style>
