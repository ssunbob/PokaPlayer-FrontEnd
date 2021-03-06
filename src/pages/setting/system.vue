<template>
	<div>
		<poka-header :title="$t('settings_systemAndUpdate')" />
		<div class="poka list">
			<v-subheader>移轉</v-subheader>
			<div class="item" @click="migratePlaylist" v-ripple>
				<div class="content">
					<v-avatar size="42px" item>
						<v-icon>queue_music</v-icon>
					</v-avatar>
					<div class="header">
						<div class="head t-ellipsis">資料庫升級</div>
						<div class="t-ellipsis">將所有播放清單之所有權移轉至您名下</div>
					</div>
				</div>
			</div>
			<v-subheader>{{$t('settings_system')}}</v-subheader>
			<div class="item" @click="restartConfirmActive=true" v-ripple>
				<div class="content">
					<v-avatar size="42px" item>
						<v-icon>autorenew</v-icon>
					</v-avatar>
					<div class="header">
						<div class="head t-ellipsis">{{$t('settings_restart')}}</div>
					</div>
				</div>
			</div>
			<div class="item" @click="openUpdateDialog" v-ripple>
				<div class="content">
					<v-avatar size="42px" item>
						<v-icon>system_update</v-icon>
					</v-avatar>
					<div class="header">
						<div class="head t-ellipsis">{{$t('settings_update')}}</div>
						<div class="t-ellipsis">
							{{checkUpadteStatus}}
							<span v-if="poka_debug">(debug: {{poka_debug}})</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<v-dialog v-model="restartConfirmActive" max-width="420">
			<v-card>
				<v-img class="poka-logo-banner" src="/img/loginHeader.svg" height="170px"></v-img>
				<v-card-title class="headline">{{$t("settings_restartDialog_title")}}</v-card-title>
				<v-card-text style="padding-bottom: 0;">
					<p>{{$t('settings_updateDialog_note')}}</p>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn text @click="restartConfirmActive=false">{{$t('cancel')}}</v-btn>
					<v-btn text @click="restartConfirmActive=false;restart()" color="primary">{{$t('ok')}}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="showUpdateDialog" max-width="420">
			<v-card>
				<v-img class="poka-logo-banner" src="/img/loginHeader.svg" height="170px"></v-img>
				<v-card-title
					class="headline"
				>{{$t("settings_updateDialog_title", { version: this.newVersion.tag})}}</v-card-title>
				<v-card-text style="padding-bottom: 0;">
					<p class="changelog" v-html="newVersion.body" />
					<p>{{$t('settings_updateDialog_note')}}</p>
				</v-card-text>
				<v-divider />
				<v-card-actions>
					<v-spacer />
					<v-btn text @click="showUpdateDialog = false">{{$t('cancel')}}</v-btn>
					<v-btn
						text
						@click="showUpdateDialog = false;update()"
						color="primary"
					>{{$t('settings_update')}}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="showUpdateingDialog" persistent max-width="280">
			<v-card>
				<v-img class="poka-logo-banner" src="/img/loginHeader.svg" height="170px"></v-img>
				<v-card-text style="padding: 0;">
					<pre class="log">{{updateLog}}</pre>
					<v-progress-linear indeterminate color="primary"></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>

		<v-dialog v-model="showRestartingDialog" persistent max-width="280">
			<v-card>
				<v-img class="poka-logo-banner" src="/img/loginHeader.svg" height="170px"></v-img>
				<p class="headline text-center font-weight-bold">{{$t("settings_restarting")}}</p>
				<poka-loader />
				<br />
			</v-card>
		</v-dialog>

		<v-dialog v-model="showRestartCompletedDialog" persistent max-width="280">
			<v-card>
				<v-img class="poka-logo-banner" src="/img/loginHeader.svg" height="170px"></v-img>
				<v-card-title class="headline">{{$t("settings_restart_completed")}}</v-card-title>
				<v-card-actions>
					<v-spacer />
					<v-btn text color="primary" @click="reload">{{$t('settings_update_reconnect')}}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default {
	name: "SettingSystem",
	data: () => ({
		checkUpadteStatus: i18n.t("settings_update_checking4updates"),
		restartConfirmActive: false,
		showUpdateDialog: false,
		showUpdateingDialog: false,
		showRestartingDialog: false,
		showRestartCompletedDialog: false,
		updateLog: "",
		poka_version: null,
		poka_debug: null,
		newVersion: {
			prerelease: null,
			tag: null,
			body: "Loading..."
		}
	}),
	created() {
		this.axios.get(_setting(`server`) + "/status/").then(response => {
			this.poka_version = response.data.version;
			this.poka_debug = response.data.debug != "false" ? response.data.debug : null;
			this.fetchNewVersion();
		});
	},
	methods: {
		openUpdateDialog() {
			if (this.poka_debug || this.newVersion.tag) this.showUpdateDialog = true;
		},
		fetchNewVersion() {
			fetch("https://api.github.com/repos/ssunbob/PokaPlayer/releases")
				.then(e => e.json())
				.then(e => {
					if(this.checkEmpty(e)){
						this.checkUpadteStatus = i18n.t("settings_update_latestVersion");
					}else{
						this.newVersion.body = new showdown.Converter().makeHtml(e[0].body);
						if (this.compareVersion(this.poka_version, e[0].tag_name)) {
							this.newVersion.prerelease = e[0].prerelease;
							this.newVersion.tag = e[0].tag_name;
							this.checkUpadteStatus = i18n.t("settings_update_update2", { version: this.newVersion.tag });
							if (this.$route.query.update) {
								this.showUpdateDialog = true
							}
						} else {
							this.checkUpadteStatus = i18n.t("settings_update_latestVersion");
						}						
					}
				})
				.catch(e => console.error(e));
		},
		update() {
			window._player.pause();
			this.axios.get("/upgrade").then(e => {
				this.showUpdateingDialog = true;
				this.updateLog += window.i18n.t("settings_update_update2", { version: this.newVersion.tag }) + "\n";
				if (e.data == "upgrade") {
					setTimeout(() => {
						alert("更新完成！");
						location.reload();
					}, 30 * 1000);
				} else if (e.data == "socket") {
					_socket.emit("login", {
						username: window._setting(`username`),
						password: window._setting(`password`)
					});
					_socket.emit("update");

					window._socket.on("Permission Denied Desu", () => {
						this.showUpdateingDialog = false;
						alert("Permission Denied");
					});
					window._socket.on("init", () => {
						this.updateLog += window.i18n.t("settings_update_initializing") + "\n";
					});
					window._socket.on("git", data => {
						this.updateLog +=
							{
								fetch: window.i18n.t("settings_update_git_fetch"),
								reset: window.i18n.t("settings_update_git_reset"),
								api: window.i18n.t("settings_update_git_api")
							}[data] + "\n";
					});
					window._socket.on("restart", () => {
						this.updateLog +=
							window.i18n.t("settings_restarting") + "...\n";
					});
					window._socket.on("hello", () => {
						this.showUpdateingDialog = false;
						this.showRestartCompletedDialog = true;
					});
					window._socket.on("err", async data => {
						const delay = interval => {
							return new Promise(resolve => {
								setTimeout(resolve, interval);
							});
						};
						this.updateLog += `[ERROR] ${data}`;
						await delay(1000);
						this.showUpdateingDialog = false;
					});
				}
			});
		},
		restart() {
			window._player.pause();
			this.showRestartingDialog = true;
			this.axios.post("/restart");
			window._socket.on("hello", () => {
				this.showRestartingDialog = false;
				this.showRestartCompletedDialog = true;
			});
		},
		reload() {
			window.location.reload();
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
		compareVersion(local, remote) {
			local = local.split(".").map(e => parseInt(e));
			remote = remote.split(".").map(e => parseInt(e));
			//版本號加權對比
			local = local[0] * 1000 * 1000 + local[1] * 1000 + local[2];
			remote = remote[0] * 1000 * 1000 + remote[1] * 1000 + remote[2];
			return remote > local;
		},
		migratePlaylist() {
			if (confirm("這項動作無法被復原，請確定您移轉到正確的帳號！"/* 記得移除這ㄍ */)) {
				this.axios.post(_setting(`server`) + "/pokaapi/v2/playlist/migrate").then(response => {
					if (response.data.success)
						this.$snackbar(`轉移成功`)
					else
						this.$snackbar(`轉移失敗，可能是您的權限不足所致`)
				});
			} else {
				this.$snackbar(`轉移已取消`)
			}
		}
	}
};
</script>
<style lang="sass" scoped>
pre.log
	background: #000
	padding: 5px
	width: 280px
	height: 200px
	overflow: scroll
	font-family: 'Ubuntu Mono', monospace
	color: #FFF
</style>
<style lang="sass" >
.changelog
	font-family: 'Ubuntu Mono', monospace
	color: currentColor
	padding: 8px
	border-radius: 8px
	background-color: rgba(0, 0, 0, .03)
	color: #000
	h1,h2,h3,h4,h5,h6
		font-size: 16px
		line-height: 1.3em
	h1
		font-size: 20px
	h2
		font-size: 18px

@media (prefers-color-scheme: dark)
	.changelog
		background-color: rgba(255, 255, 255, 0.04)
		color: #FFF
</style>
