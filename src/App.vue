<template>
	<v-app class="page-container">
		<transition name="fade" mode="out-in">
			<router-view />
		</transition>
		<v-snackbar
			v-model="snackbar.show"
			:class="{'withBottomPlayer':snackbar.withBottomPlayer}"
		>{{snackbar.message}}</v-snackbar>
	</v-app>
</template>
<script>
import Vue from "vue";
export default {
	created() {
		Vue.prototype.$goBack = () => {
			window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
		}
		Vue.prototype.$deepCopy = d => JSON.parse(JSON.stringify(d))
		Vue.prototype.$randomPlay = window._randomPlay;
		Vue.prototype.$addSongs = window._addSongs;
		//註冊點心條組件
		Vue.prototype.$snackbar = (msg = ``, duration = 1500) => {
			this.snackbar.message = msg;
			this.snackbar.withBottomPlayer = document.querySelectorAll('.bottom-player').length
			this.snackbar.show = true;
			clearTimeout(this.snackbar.timeout);
			this.snackbar.timeout = setTimeout(() => (this.snackbar.show = false), duration);
		};
		// set theme color
		this.$vuetify.theme.themes.dark.primary = window._setting('theme')
		this.$vuetify.theme.themes.light.primary = window._setting('theme')
	},
	data: () => ({
		snackbar: { show: false, message: ``, timeout: null, withBottomPlayer: true },
	})
}
</script>
<style lang="sass">
@import "@/assets/pokaList.sass"
@import "@/assets/main.sass"
</style>
<style lang="scss">
	.page-container {
		overflow: hidden;
		height: 100vh;
		width: 100vw;
		&.theme--dark {
			background: #282535 !important;
		}
	}
	.theme--dark.v-sheet,
	.theme--dark.v-navigation-drawer,
	.theme--dark.v-tabs-items,
	.theme--dark.v-stepper {
		border-color: #2f2b3e;
		background: #2f2b3e !important;
	}
	.v-application.v-application {
		font-family: var(--default-font);
	}
	.v-card:not(.v-sheet--tile):not(.v-card--shaped) {
		border-radius: 8px !important;
	}
	.v-card + .v-card {
		margin-top: 16px;
	}
	.t-ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.v-snack--bottom.withBottomPlayer {
		bottom: 77px !important;
	}
	.v-snack__wrapper {
		background-color: rgba(57, 53, 77, 0.8) !important;
		backdrop-filter: blur(3px) !important;
	}
	nav .theme--dark.v-list-item--active:hover::before,
	nav .theme--dark.v-list-item--active::before {
		opacity: 0.2;
		background-color: #776ea0;
	}
	nav .theme--dark.v-list-item--active,
	nav .theme--dark.v-list-item--active {
		color: #fff !important;
	}
	.material-icons-outlined.material-icons-outlined.material-icons-outlined {
		font-family: "Material Icons Outlined" !important;
	}
	#playlist-dialog {
		.theme--dark.v-list-item--active:hover::before,
		.theme--dark.v-list-item--active::before {
			opacity: 0 !important;
		}
		.theme--dark.v-list-item,
		.v-list-item--link:before {
			border-radius: 8px !important;
		}
	}
</style>
<style lang="sass">
//---------------------//
//       v-card        //
//---------------------//
.v-card.blur-card
	background-color: rgb(255 255 255 / 70%) !important
	backdrop-filter: blur(20px)
	box-shadow: none !important
	&.theme--dark
		background: rgb(47 43 62 / .7) !important
//---------------------//
//       dial0g        //
//---------------------//
.v-dialog--fullscreen
	margin: 0 5px !important
	width: calc(100vw - 10px) !important
	top: auto !important
	bottom: 3px !important
	min-height: 90% !important
	height: 90% !important
.v-dialog__content.v-dialog__content--active
	background-color: rgb(0 0 0 / 40%)
	backdrop-filter: blur(10px)
.v-dialog.v-dialog--fullscreen > .v-card > .v-card__text
	padding: 0 2px 20px !important
</style>