<script lang="ts">
	type Tally = { y: number | null; n: number | null; a: number | null };
	type Row = {
		day: string;
		dow: string;
		id: string;
		title: string;
		tags: string[];
		tally: Tally;
		bar: { yes: number; no: number; abs: number } | null;
		result: 'Adopted' | 'Rejected' | 'Vetoed' | 'Consensus';
		note?: string;
	};
	type Month = { year: string; name: string; total: number; contested: number; rows: Row[] };

	const months: Month[] = [
		{
			year: '2024',
			name: 'December',
			total: 34,
			contested: 6,
			rows: [
				{
					day: '19',
					dow: 'Thu',
					id: 'A/RES/79/87',
					title:
						'Strengthening of the coordination of emergency humanitarian assistance of the United Nations',
					tags: ['Humanitarian', 'Annual item'],
					tally: { y: null, n: null, a: null },
					bar: null,
					result: 'Consensus',
					note: 'Adopted without a vote'
				},
				{
					day: '17',
					dow: 'Tue',
					id: 'A/RES/79/144',
					title: 'Right of peoples to self-determination',
					tags: ['Human rights', 'Self-determination'],
					tally: { y: 175, n: 0, a: 7 },
					bar: { yes: 96.2, no: 0, abs: 3.8 },
					result: 'Adopted'
				},
				{
					day: '11',
					dow: 'Wed',
					id: 'A/RES/79/12',
					title: 'Situation in the Occupied Palestinian Territory and the Syrian Golan',
					tags: ['Middle East', 'Contested'],
					tally: { y: 156, n: 9, a: 18 },
					bar: { yes: 85.2, no: 4.9, abs: 9.9 },
					result: 'Adopted'
				},
				{
					day: '05',
					dow: 'Thu',
					id: 'A/RES/79/110',
					title: 'Cooperation between the United Nations and the African Union',
					tags: ['Africa', 'Partnerships'],
					tally: { y: null, n: null, a: null },
					bar: null,
					result: 'Consensus',
					note: 'Adopted without a vote'
				}
			]
		},
		{
			year: '2024',
			name: 'November',
			total: 28,
			contested: 4,
			rows: [
				{
					day: '22',
					dow: 'Fri',
					id: 'A/RES/79/45',
					title: 'Sustainable Development Goals mid-term review and reporting framework',
					tags: ['SDGs', 'Development'],
					tally: { y: 180, n: 1, a: 5 },
					bar: { yes: 96.8, no: 0.5, abs: 2.7 },
					result: 'Adopted'
				},
				{
					day: '15',
					dow: 'Fri',
					id: 'A/RES/79/29',
					title:
						'Combating glorification of Nazism, neo-Nazism and other practices that contribute to fuelling contemporary forms of racism',
					tags: ['Anti-discrimination', 'Contested'],
					tally: { y: 112, n: 50, a: 14 },
					bar: { yes: 63.6, no: 28.4, abs: 8.0 },
					result: 'Adopted'
				}
			]
		},
		{
			year: '2024',
			name: 'October',
			total: 22,
			contested: 3,
			rows: [
				{
					day: '30',
					dow: 'Wed',
					id: 'A/RES/79/02',
					title:
						'Necessity of ending the economic, commercial and financial embargo imposed by the United States of America against Cuba',
					tags: ['Sanctions', 'Americas', 'Annual item'],
					tally: { y: 187, n: 2, a: 1 },
					bar: { yes: 98.4, no: 1.1, abs: 0.5 },
					result: 'Adopted'
				},
				{
					day: '09',
					dow: 'Wed',
					id: 'A/RES/79/63',
					title: 'Promotion of inclusive dialogue and tolerance against hate speech',
					tags: ['Human rights'],
					tally: { y: 166, n: 2, a: 12 },
					bar: { yes: 92.2, no: 1.1, abs: 6.7 },
					result: 'Adopted'
				}
			]
		}
	];

	const START_YEAR = 1946;
	const END_YEAR = 2024;
	const N_YEARS = END_YEAR - START_YEAR + 1;
	const SEL_START = 2014;
	const SEL_END = 2024;

	function countsFor(yi: number): number {
		const t = yi / (N_YEARS - 1);
		const base = 60 + 280 * (1 - Math.pow(1 - t, 1.5));
		const w = Math.sin(yi * 1.7) * 22 + Math.cos(yi * 0.6) * 14;
		return Math.max(40, Math.round(base + w));
	}

	const yearBars = (() => {
		const data: number[] = [];
		let max = 0;
		for (let y = 0; y < N_YEARS; y++) {
			const c = countsFor(y);
			data.push(c);
			if (c > max) max = c;
		}
		return data.map((c, y) => {
			const year = START_YEAR + y;
			return {
				year,
				count: c,
				height: Math.max(2, (c / max) * 40),
				inRange: year >= SEL_START && year <= SEL_END
			};
		});
	})();

	let mode = $state<'compact' | 'timeline'>('timeline');
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
		<div class="right">⌕ Search</div>
	</div>
</header>

<main class="page-wrap">
	<div class="page-eyebrow">General Assembly · 1st – 79th sessions</div>
	<h1 class="page-title">General Assembly voting records</h1>
	<p class="page-deck">
		Every plenary resolution since 1946. Drag the year strip to zoom in on a period, filter by
		subject or result, then read the record either as a dense table or as a narrative timeline.
	</p>

	<div class="d5-activity">
		<div class="d5-activity-head">
			<div class="label"><b>Resolutions per year</b> · GA, 1946–2024</div>
			<div class="range">
				Selected <b>{SEL_START} – {SEL_END}</b><span class="reset">reset</span>
			</div>
		</div>
		<div class="d5-bars" aria-label="Resolutions per year, 1946–2024">
			{#each yearBars as b (b.year)}
				<div
					class="b"
					class:in-range={b.inRange}
					class:dim={!b.inRange}
					style:height="{b.height}px"
					title="{b.year} · {b.count} resolutions"
				></div>
			{/each}
		</div>
		<div class="d5-axis">
			<span>1946</span><span>1960</span><span>1975</span>
			<span>1990</span><span>2005</span><span>2024</span>
		</div>
	</div>

	<div class="filter-bar">
		<div class="filter-field">
			<label for="search-q">Search</label>
			<div class="input" id="search-q">
				<span class="ph">Title, resolution ID, country…</span><span class="ico">⌕</span>
			</div>
		</div>
		<div class="filter-field">
			<span class="label">Subject</span>
			<div class="select">All subjects</div>
		</div>
		<div class="filter-field">
			<span class="label">Result</span>
			<div class="select">All results</div>
		</div>
		<div class="filter-field">
			<span class="label">Vote type</span>
			<div class="select">Recorded + Consensus</div>
		</div>
		<button class="filter-btn" type="button">Apply</button>
	</div>

	<div class="active-filters">
		<span>Filtered by</span>
		<span class="chip">Years · 2014–2024 <span class="x">✕</span></span>
		<span class="chip">Subject · Middle East <span class="x">✕</span></span>
		<span class="clear-all">Clear all</span>
	</div>

	<div class="d5" data-mode={mode}>
		<div class="d5-toolbar">
			<div class="left">
				Showing <b>1 – 8</b> of <b>1,847</b> resolutions across <b>10 years</b>
			</div>
			<div class="right">
				<span class="sort">Sort · Date (newest) ▾</span>
				<div class="d5-toggle" role="group" aria-label="Row density">
					<button
						type="button"
						aria-pressed={mode === 'compact'}
						onclick={() => (mode = 'compact')}>Compact</button
					>
					<button
						type="button"
						aria-pressed={mode === 'timeline'}
						onclick={() => (mode = 'timeline')}>Timeline</button
					>
				</div>
			</div>
		</div>

		{#each months as m}
			<div class="d5-month">
				<div class="m-year">{m.year}</div>
				<div class="m-name">{m.name}</div>
				<div class="m-meta"><b>{m.total}</b> resolutions · {m.contested} contested</div>
			</div>
			<div class="d5-colheads">
				<span>Day</span>
				<span>Resolution</span>
				<span>Title</span>
				<span class="ar">Yes</span>
				<span class="ar">No</span>
				<span class="ar">Abs</span>
				<span>Distribution</span>
				<span>Result</span>
			</div>
			{#each m.rows as r}
				<div class="d5-row">
					<div class="day">{r.day}<span class="dow">{r.dow}</span></div>
					<div class="id">{r.id}</div>
					<div class="title">
						{r.title}
						<div class="tags">
							{#each r.tags as t}
								<span class="tag">{t}</span>
							{/each}
						</div>
					</div>
					<div class="num v-yes">{r.tally.y ?? '—'}</div>
					<div class="num v-no">{r.tally.n ?? '—'}</div>
					<div class="num v-abs">{r.tally.a ?? '—'}</div>
					<div class="stack-bar inline" class:consensus={!r.bar}>
						{#if r.bar}
							<span style:background="var(--vote-yes)" style:width="{r.bar.yes}%"></span>
							<span style:background="var(--vote-no)" style:width="{r.bar.no}%"></span>
							<span style:background="var(--vote-abstain)" style:width="{r.bar.abs}%"></span>
						{:else}
							<span style:background="var(--gray-300)" style:width="100%"></span>
						{/if}
					</div>
					<div class="result">
						<span class="badge adopted">{r.result}</span>
					</div>
					<div class="timeline-only">
						{#if r.bar}
							<div class="nums">
								<span class="v-yes"><b>{r.tally.y}</b> Y</span> ·
								<span class="v-no"><b>{r.tally.n}</b> N</span> ·
								<span class="v-abs"><b>{r.tally.a}</b> A</span>
							</div>
							<div class="stack-bar">
								<span style:background="var(--vote-yes)" style:width="{r.bar.yes}%"></span>
								<span style:background="var(--vote-no)" style:width="{r.bar.no}%"></span>
								<span style:background="var(--vote-abstain)" style:width="{r.bar.abs}%"></span>
							</div>
						{:else}
							<div class="nums consensus-note">{r.note}</div>
						{/if}
						<div class="result"><span class="badge adopted">{r.result}</span></div>
					</div>
				</div>
			{/each}
		{/each}

		<div class="pagination">
			<div>
				Showing <b>1–8</b> of <b>1,847</b> resolutions in selected range
			</div>
			<div class="pages">
				<button class="pg-btn" type="button" disabled>← Previous</button>
				<span class="pg-num">Page 1 / 231</span>
				<button class="pg-btn" type="button">Next →</button>
			</div>
		</div>
	</div>
</main>

<style>
	/* === Product header (page-scoped) === */
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
	.un-header .right {
		margin-left: auto;
		font-size: var(--fs-xs);
		color: var(--fg-4);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
	}

	.page-wrap {
		max-width: 1080px;
		margin: 0 auto;
		padding: 32px 24px 64px;
	}
	.page-eyebrow {
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		color: var(--fg-3);
		margin-bottom: 10px;
	}
	.page-title {
		font-size: var(--fs-2xl);
		font-weight: var(--fw-bold);
		letter-spacing: var(--tracking-wide);
		line-height: var(--lh-tight);
		margin: 0 0 10px 0;
		color: var(--fg-strong);
	}
	.page-deck {
		font-size: var(--fs-md);
		color: var(--fg-2);
		max-width: 64ch;
		margin: 0 0 24px 0;
		line-height: var(--lh-snug);
	}

	/* === Vote color helpers === */
	.v-yes {
		color: var(--vote-yes);
	}
	.v-no {
		color: var(--vote-no);
	}
	.v-abs {
		color: var(--vote-abstain);
	}

	/* === Badges === */
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

	/* === Tags === */
	.tag {
		display: inline-block;
		font-size: 10px;
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		padding: 2px 6px;
		border: 1px solid var(--border);
		border-radius: var(--radius-1);
		color: var(--fg-3);
		margin-right: 4px;
	}

	/* === Filter bar === */
	.filter-bar {
		border: 1px solid var(--border);
		border-radius: var(--radius-3);
		background: var(--bg);
		padding: 14px 16px;
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr 1fr auto;
		gap: 12px;
		align-items: end;
		margin-bottom: 20px;
	}
	.filter-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}
	.filter-field label,
	.filter-field .label {
		font-size: 10px;
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		color: var(--fg-3);
		font-weight: var(--fw-semibold);
	}
	.filter-field .input,
	.filter-field .select {
		height: 32px;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-2);
		background: var(--bg);
		padding: 0 10px;
		font: inherit;
		font-size: var(--fs-sm);
		color: var(--fg);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.filter-field .input .ico,
	.filter-field .input .ph {
		color: var(--fg-4);
	}
	.filter-field .select::after {
		content: '▾';
		font-size: 9px;
		color: var(--fg-4);
	}
	.filter-btn {
		height: 32px;
		padding: 0 14px;
		background: var(--fg-strong);
		color: var(--fg-on-dark);
		border: 1px solid var(--fg-strong);
		border-radius: var(--radius-2);
		font: inherit;
		font-size: var(--fs-xs);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		font-weight: var(--fw-semibold);
		cursor: pointer;
	}

	.active-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
		margin: -8px 0 18px 0;
		font-size: var(--fs-xs);
		color: var(--fg-3);
		letter-spacing: var(--tracking-wide);
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 1px solid var(--border);
		background: var(--bg);
		border-radius: var(--radius-pill);
		padding: 3px 10px;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wider);
		color: var(--fg-2);
	}
	.chip .x {
		color: var(--fg-4);
	}
	.clear-all {
		margin-left: auto;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	/* === Year activity strip === */
	.d5-activity {
		border: 1px solid var(--border);
		border-radius: var(--radius-3);
		background: var(--bg);
		padding: 14px 16px 12px;
		margin-bottom: 16px;
	}
	.d5-activity-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 10px;
		gap: 16px;
		flex-wrap: wrap;
	}
	.d5-activity-head .label {
		font-size: 10px;
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		color: var(--fg-3);
		font-weight: var(--fw-semibold);
	}
	.d5-activity-head .label b {
		color: var(--fg-strong);
		font-weight: var(--fw-semibold);
	}
	.d5-activity-head .range {
		font-size: var(--fs-xs);
		color: var(--fg-2);
		letter-spacing: var(--tracking-wide);
	}
	.d5-activity-head .range b {
		color: var(--fg-strong);
		font-weight: var(--fw-semibold);
		font-variant-numeric: tabular-nums;
	}
	.d5-activity-head .range .reset {
		margin-left: 10px;
		color: var(--fg-3);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
	.d5-bars {
		height: 44px;
		display: flex;
		align-items: flex-end;
		gap: 1px;
		position: relative;
		border-bottom: 1px solid var(--gray-200);
		padding-bottom: 2px;
	}
	.d5-bars .b {
		flex: 1;
		min-width: 0;
		background: var(--gray-300);
		border-radius: 1px 1px 0 0;
		transition: background var(--dur) var(--ease);
	}
	.d5-bars .b.in-range {
		background: var(--fg-strong);
	}
	.d5-bars .b.dim {
		background: var(--gray-200);
	}
	.d5-axis {
		display: flex;
		justify-content: space-between;
		font-size: 9px;
		color: var(--fg-4);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		margin-top: 6px;
		font-variant-numeric: tabular-nums;
	}

	/* === Toolbar === */
	.d5-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 0 12px;
		border-top: 1px solid var(--gray-200);
		border-bottom: 1px solid var(--gray-200);
		flex-wrap: wrap;
		gap: 12px;
	}
	.d5-toolbar .left {
		font-size: var(--fs-xs);
		color: var(--fg-3);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
	}
	.d5-toolbar .left b {
		color: var(--fg-strong);
		font-weight: var(--fw-semibold);
	}
	.d5-toolbar .right {
		display: flex;
		gap: 14px;
		align-items: center;
		font-size: var(--fs-xs);
		color: var(--fg-3);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
	}
	.d5-toolbar .sort {
		cursor: pointer;
		color: var(--fg-2);
	}
	.d5-toggle {
		display: inline-flex;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-2);
		overflow: hidden;
	}
	.d5-toggle button {
		appearance: none;
		background: var(--bg);
		border: 0;
		color: var(--fg-2);
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		font-weight: var(--fw-semibold);
		padding: 6px 12px;
		cursor: pointer;
	}
	.d5-toggle button + button {
		border-left: 1px solid var(--border-strong);
	}
	.d5-toggle button[aria-pressed='true'] {
		background: var(--fg-strong);
		color: var(--fg-on-dark);
	}

	/* === Month band === */
	.d5-month {
		display: grid;
		grid-template-columns: 96px 1fr auto;
		gap: 16px;
		align-items: baseline;
		padding: 14px 0 8px;
		border-bottom: 1px solid var(--gray-300);
		margin-top: 18px;
		background: var(--bg);
	}
	.d5-month .m-year {
		font-size: 10px;
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		color: var(--fg-3);
	}
	.d5-month .m-name {
		font-size: var(--fs-lg);
		font-weight: var(--fw-bold);
		letter-spacing: var(--tracking-tight);
		color: var(--fg-strong);
	}
	.d5-month .m-meta {
		font-size: 10px;
		color: var(--fg-3);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
	}
	.d5-month .m-meta b {
		color: var(--fg-strong);
		font-weight: var(--fw-semibold);
	}

	/* === Unified row === */
	.d5-row {
		display: grid;
		align-items: center;
		border-bottom: 1px solid var(--border-muted);
		padding: 10px 0;
		cursor: pointer;
		transition: background var(--dur) var(--ease);
	}
	.d5-row:hover {
		background: var(--bg-subtle);
	}

	/* Compact mode */
	.d5[data-mode='compact'] .d5-row {
		grid-template-columns: 56px 110px minmax(0, 1fr) 56px 56px 56px 140px 90px;
		gap: 12px;
		padding: 10px 0;
		font-size: var(--fs-sm);
	}
	.d5[data-mode='compact'] .d5-row .day {
		font-size: 14px;
		font-weight: var(--fw-semibold);
		color: var(--fg-strong);
		letter-spacing: var(--tracking-tight);
	}
	.d5[data-mode='compact'] .d5-row .day .dow {
		font-size: 9px;
		color: var(--fg-4);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		margin-left: 6px;
		font-weight: var(--fw-medium);
	}
	.d5[data-mode='compact'] .d5-row .id {
		font-family: var(--font-mono);
		font-weight: var(--fw-medium);
		color: var(--fg-strong);
		font-size: var(--fs-xs);
		letter-spacing: var(--tracking-wider);
		white-space: nowrap;
	}
	.d5[data-mode='compact'] .d5-row .title {
		color: var(--fg);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: var(--lh-snug);
	}
	.d5[data-mode='compact'] .d5-row .title .tags {
		display: none;
	}
	.d5[data-mode='compact'] .d5-row .num {
		text-align: right;
		font-variant-numeric: tabular-nums;
		font-weight: var(--fw-medium);
	}
	.d5[data-mode='compact'] .d5-row .stack-bar {
		height: 6px;
		width: 140px;
		background: var(--gray-150);
		border-radius: 1px;
		display: flex;
		overflow: hidden;
	}
	.d5[data-mode='compact'] .d5-row .stack-bar.consensus {
		opacity: 0.4;
	}
	.d5[data-mode='compact'] .d5-row .stack-bar span {
		display: block;
		height: 100%;
	}
	.d5[data-mode='compact'] .d5-row .result {
		white-space: nowrap;
	}
	.d5[data-mode='compact'] .d5-row .timeline-only {
		display: none;
	}

	/* Compact column headers */
	.d5-colheads {
		display: none;
	}
	.d5[data-mode='compact'] .d5-colheads {
		display: grid;
		grid-template-columns: 56px 110px minmax(0, 1fr) 56px 56px 56px 140px 90px;
		gap: 12px;
		padding: 8px 8px;
		font-size: 9px;
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		color: var(--fg-3);
		font-weight: var(--fw-semibold);
		border-bottom: 1px solid var(--border);
		background: var(--bg-subtle);
		margin: 0 -8px;
	}
	.d5[data-mode='compact'] .d5-colheads .ar {
		text-align: right;
	}

	/* Timeline mode */
	.d5[data-mode='timeline'] .d5-row {
		grid-template-columns: 96px minmax(0, 1fr) 240px;
		grid-template-rows: auto auto;
		gap: 4px 20px;
		padding: 14px 0;
		align-items: start;
	}
	.d5[data-mode='timeline'] .d5-row .day {
		grid-column: 1;
		grid-row: 1 / span 2;
		font-size: 28px;
		font-weight: var(--fw-bold);
		color: var(--fg-strong);
		line-height: 1;
		letter-spacing: var(--tracking-tight);
		font-variant-numeric: tabular-nums;
	}
	.d5[data-mode='timeline'] .d5-row .day .dow {
		display: block;
		font-size: 9px;
		color: var(--fg-4);
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		font-weight: var(--fw-medium);
		margin-left: 0;
		margin-top: 6px;
	}
	.d5[data-mode='timeline'] .d5-row .id {
		grid-column: 2;
		grid-row: 1;
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		color: var(--fg-3);
		margin-bottom: 0;
		display: block;
	}
	.d5[data-mode='timeline'] .d5-row .title {
		grid-column: 2;
		grid-row: 2;
		font-size: var(--fs-md);
		color: var(--fg);
		line-height: var(--lh-snug);
		margin-bottom: 0;
		text-wrap: pretty;
	}
	.d5[data-mode='timeline'] .d5-row .title .tags {
		display: block;
		margin-top: 6px;
	}
	/* Hide compact-mode cells in timeline */
	.d5[data-mode='timeline'] .d5-row > .num,
	.d5[data-mode='timeline'] .d5-row > .stack-bar.inline,
	.d5[data-mode='timeline'] .d5-row > .result {
		display: none;
	}
	.d5[data-mode='timeline'] .d5-row .timeline-only {
		grid-column: 3;
		grid-row: 1 / span 2;
		display: block;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.d5[data-mode='timeline'] .d5-row .timeline-only .nums {
		font-size: var(--fs-sm);
		color: var(--fg-3);
		margin-bottom: 6px;
		letter-spacing: var(--tracking-wide);
	}
	.d5[data-mode='timeline'] .d5-row .timeline-only .nums b {
		font-weight: var(--fw-semibold);
	}
	.d5[data-mode='timeline'] .d5-row .timeline-only .nums.consensus-note {
		color: var(--fg-3);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		font-size: 10px;
	}
	.d5[data-mode='timeline'] .d5-row .timeline-only .stack-bar {
		height: 4px;
		width: 200px;
		margin-left: auto;
		margin-bottom: 8px;
		background: var(--gray-150);
		border-radius: 1px;
		display: flex;
		overflow: hidden;
	}
	.d5[data-mode='timeline'] .d5-row .timeline-only .stack-bar span {
		display: block;
		height: 100%;
	}
	.d5[data-mode='timeline'] .d5-row .timeline-only .result {
		font-size: 10px;
	}

	/* === Pagination === */
	.pagination {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 22px;
		font-size: var(--fs-xs);
		color: var(--fg-3);
		letter-spacing: var(--tracking-wide);
	}
	.pagination b {
		color: var(--fg-strong);
		font-weight: var(--fw-semibold);
	}
	.pagination .pages {
		display: flex;
		gap: 4px;
		align-items: center;
	}
	.pg-btn {
		border: 1px solid var(--border-strong);
		background: var(--bg);
		padding: 6px 10px;
		border-radius: var(--radius-2);
		font: inherit;
		font-size: 10px;
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		color: var(--fg-2);
		cursor: pointer;
	}
	.pg-btn[disabled] {
		color: var(--fg-4);
		border-color: var(--border);
		cursor: default;
	}
	.pg-num {
		padding: 0 8px;
		color: var(--fg-strong);
	}
</style>
