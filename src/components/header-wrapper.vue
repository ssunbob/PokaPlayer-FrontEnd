<template lang="pug">
div(style="position: sticky;top: 15px;")
	.header-wrapper
		.bg(:style=`Object.assign({backgroundImage: 'url("'+bg+'")'},bgStyle)`,:class="{blur: blurbg}")
	.hw-header(v-if='title',:style="headerStyle")
		.hw-title(style="line-height: normal;") {{title}}
		.hw-subtitle {{subtitle}}
</template>

<script>
export default {
	name: "poka-header",
	data: () => ({
		headerStyle: {
			opacity: 1,
			transform: ''
		},
		bgStyle: {
			transform: '',
		}
	}),
	props: {
		title: String,
		subtitle: String,
		bg: {
			type: String,
			default: _setting(`headerBgSource`)
		},
		blurbg: { type: Boolean, default: false }
	},
	methods: {
		handleScroll(event) {
			if (document.querySelector('main')) {
				let scrollTop = document.querySelector('main').scrollTop;
				let scrollHeight = document.querySelector('main').scrollHeight
				let targetHideHeight = 40
				this.headerStyle.opacity = scrollTop > targetHideHeight ? 0 : 1
				this.headerStyle.transform = `translate(0,-${scrollTop > targetHideHeight ? 20 : (scrollTop / targetHideHeight * 20)}px)`
				this.bgStyle.transform = `scale(1.12) translate(0,-${scrollTop / scrollHeight * 50}px)`
			}
		}
	},
	mounted() {
		this.handleScroll()
		if (document.querySelector('main'))
			document.querySelector('main').addEventListener('scroll', this.handleScroll);
	},
	created() {
		this.handleScroll()
		if (document.querySelector('main'))
			document.querySelector('main').addEventListener('scroll', this.handleScroll);
	},
	destroyed() {
		if (document.querySelector('main'))
			document.querySelector('main').removeEventListener('scroll', this.handleScroll);
	}
};
</script>
<style lang="sass">
.header-wrapper
	width: 100%
	position: relative
	min-height: 1px
	margin-top: -1px
	pointer-events: none
	.bg
		transform: scale(1.12)
		background-size: cover
		background-position: center
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 100%)
		-webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 100%)
		width: 100%
		position: absolute
		transition: min-height .4s
		min-height: var(--pokabgheight,400px)
		overflow: hidden
	.bg.blur
		filter: blur(5px)
.hw-header
	font-weight: bold
	margin-left: 16px
	margin-top: 32px
	margin-bottom: 32px
	position: relative
	font-family: var(--product-font)
	transition: opacity .25s ease
	>.hw-title,>.hw-subtitle
		overflow: hidden
		text-overflow: ellipsis
		white-space: nowrap
		line-height: 1.1em
	>.hw-title
		font-size: 3.5em
	>.hw-subtitle
		font-size: 1.5em
</style>