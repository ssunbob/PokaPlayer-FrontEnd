<template>
	<div class="update-notify" key="0" v-if="checkUpadteStatus">
		<h1>{{$t('settings_update')}}</h1>
		<p>{{checkUpadteStatus}}</p>

		<v-btn
			outlined
			to="/settings/system?update=true"
			color="white"
			dark
		>{{$t('settings_update_go2UpdatePage')}}</v-btn>
	</div>
</template>
<style lang="sass" scoped>
.update-notify
	background: #2f2b3e
	text-shadow: 0 0 6px #2f2b3e
	position: relative
	margin: 16px 2px
	padding: 24px 32px
	border-radius: 8px
	background-size: 240px
	background-position: right
	background-repeat: no-repeat
	background-image: url('/img/update.svg')
	color: #FFF
	box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.3)
</style>
<script>
export default {
	name: "poka-update",
	created() {
		this.axios
			.get(_setting(`server`) + "/status/")
			.then(res => res.data)
			.then(data => {
				let isAdmin = JSON.parse(sessionStorage.getItem("login")).role == 'admin' || false
				if (data.debug) this.debug = data.debug;
				if (isAdmin) this.fetchNewVersion(data.version, isAdmin);
			});
	},
	data: () => ({ checkUpadteStatus: null, debug: null }),
	methods: {
		compareVersion(local, remote) {
			local = local.split(".").map(e => parseInt(e));
			remote = remote.split(".").map(e => parseInt(e));
			//版本號加權對比
			local = local[0] * 1000 * 1000 + local[1] * 1000 + local[2];
			remote = remote[0] * 1000 * 1000 + remote[1] * 1000 + remote[2];
			return remote > local;
		},
		checkEmpty(value) {
			switch (typeof value) {
				case 'undefined':
					return true;
				case 'string':
					if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
					break;
				case 'boolean':
					if (!value) return true;
					break;
				case 'number':
					if (0 === value || isNaN(value)) return true;
					break;
				case 'object':
					if (null === value || value.length === 0) return true;
					for (var i in value) {
						return false;
					}
					return true;
			}
			return false;
		},
		async fetchNewVersion(currentVersion, isAdmin) {
			let storageId = `poka-github-check-${new Date().toJSON().slice(0, 10).replace(/-/g, '/')}`

			let githubRes = JSON.parse(sessionStorage[storageId] || null)
			if (!githubRes) {
				githubRes = await fetch("https://api.github.com/repos/ssunbob/PokaPlayer/releases")
					.then(e => e.json())
					.then(e => { sessionStorage[storageId] = JSON.stringify(e); return e })
					.catch(e => console.error(e))
			}
			if(!this.checkEmpty(githubRes)){
				if (this.compareVersion(currentVersion, githubRes[0].tag_name) || this.debug) {
					this.checkUpadteStatus = i18n.t("settings_update_canUpdate2", { version: githubRes[0].tag_name });
					if (this.debug)
						this.checkUpadteStatus += ` (debug: ${this.debug})`;
				}				
			}
		}
	}
};
</script>
