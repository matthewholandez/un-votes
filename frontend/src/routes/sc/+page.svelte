<script lang="ts">
</script>

<svelte:head>
	<title>Security Council - Coming Soon | UN Votes</title>
</svelte:head>

<header class="site-header">
	<div class="page-wrap bar">
		<a class="site-logo" href="/">UN&nbsp;VOTES</a>
		<nav class="nav-links">
			<a class="nav-link" href="/">Home</a>
			<a class="nav-link" href="/ga">General Assembly</a>
			<a class="nav-link is-active" href="/sc">Security Council</a>
			<a class="nav-link" href="/about">About</a>
		</nav>
	</div>
</header>

<main class="page-wrap sc-soon fade-in">
	<div class="coming-soon">
		<div class="eyebrow">Security Council</div>
		<h1 class="display">Coming Soon</h1>
		<p class="desc">
			We are currently preparing the voting records for the Security Council. 
			Check back later for comprehensive data on vetoes and adopted resolutions.
		</p>
		<a href="/" class="btn btn-outline">← Back to Home</a>
	</div>
</main>

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

	.sc-soon {
		padding: 120px 0;
		min-height: calc(100vh - 200px);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.coming-soon {
		text-align: center;
		max-width: 480px;
	}

	.eyebrow {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--fg-3);
		margin-bottom: 24px;
	}

	.display {
		font-size: clamp(48px, 6vw, 72px);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1;
		margin: 0 0 24px 0;
		color: var(--fg-strong);
	}

	.desc {
		font-size: clamp(15px, 1.6vw, 18px);
		color: var(--fg-2);
		line-height: 1.55;
		margin: 0 0 40px 0;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		padding: 12px 24px;
		border-radius: 2px;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all var(--dur, 200ms) var(--ease, ease);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
	}

	.btn-outline {
		background: transparent;
		color: var(--fg-strong);
		border-color: var(--gray-950);
	}

	.btn-outline:hover {
		background: var(--fg-strong);
		color: var(--fg-on-dark, #fff);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.fade-in {
		animation: fade-in 400ms var(--ease, ease) both;
	}
</style>
