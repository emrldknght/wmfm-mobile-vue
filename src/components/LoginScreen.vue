<template>
	<div class="wrapper">
		<template v-if="error">
			<span class="error">{{ error }}</span>
		</template>
		<div class="form">
			<div style="width: 100%; text-align: center; font-weight: bolder;">
				Login screen
			</div>
			<form>
				<label for="u-login">Login:</label>
				<input type="text" id="u-login"
					   v-model="login" name="username" autocomplete="username">
				<label for="u-pass">Password:</label>
					<input type="password" id="u-pass"
						   v-model="pass" name="password" autocomplete="current-password">
				<label><input type="checkbox" v-model="save">Save</label>
				<br>
				<button @click.prevent="authorize">Go!</button>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {Credentials, emptyCred, getCred, isCredEmpty, saveCred} from "../interfaces/Credentials";
	import {Watch} from "vue-property-decorator";
	import {EventBus} from "../EventBus";
	import {Events} from "../Events";
	import {IAnswer} from "../interfaces/IAnswer";
	import {auth} from "../lib/AjaxApi/auth";

	const SAVE_CR = 'save-login';

	@Component({
		props: {
			processAuth: Function
		}
	})
    export default class LoginScreen extends Vue{
        login: string = '';
        pass: string = '';
        error: string = '';
        save: boolean = false;

        @Watch('save')
		onSaveChanged() {
			// console.log('watch');
			localStorage.setItem(SAVE_CR, this.save.toString());
		}

		private setCredentials(cred: Credentials) {
			this.login = cred.login;
			this.pass = cred.password;
		}

        authorize(e?: Event) {
        	// if (e) e.preventDefault();

        	// console.log('Logging in...');
			auth(this.login, this.pass).then((j: IAnswer) => {
			    // console.log(j);
			    if(j.error) {
			        this.error = j.error;
				} else {
			    	if(this.save) {
						const credentials: Credentials = {login: this.login, password: this.pass};
						saveCred(credentials);
					}
			    	this.$props.processAuth(j.PHPSESSID, j);
			        // document.location.reload();
				}
			});
		}
		parseURL() {

			const curl: URL = new URL(document.location.toString());
			const params = new URLSearchParams(curl.search);
			let cred: Credentials = Object.assign({}, emptyCred);

			for (let pair of params.entries()) {
				cred[<keyof Credentials>pair[0]] = pair[1];
			}

			const isEmpty = isCredEmpty(cred);
			// console.log('cr', cred, isEmpty);
			if(!isEmpty) {
				// this.login = cred.login;
				// this.pass = cred.password;
				this.setCredentials(cred);

				this.authorize();
				return true;
			}
			return false;
		}
		mounted() {
        	EventBus.on(Events.Authorize, () => this.authorize());
			const fromUrl = this.parseURL();
        	if(fromUrl) return;

			const save = localStorage.getItem(SAVE_CR);
        	if(save) {
        		this.save = (save === 'true');
			}

			const cred: Credentials = getCred();
        	// console.log(cred);
			if(cred) {
				// this.login = cred.login;
				// this.pass = cred.password;
				this.setCredentials(cred);
			}
		}
    }
</script>

<style scoped>
	.form {
		border: 4px double white;
		padding: 20px;
	}
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		align-content: center;
		justify-content: center;
		justify-items: center;

		width: 100%;
		height: 100%;
		margin-top:30vh;
		color:white;
	}
	form {
		display: flex;
		flex-direction: column;
	}
	label {
		width: 100%;
	}
	.error {
		background-color: crimson;
		color: white;
		padding:20px;
		border-radius:1%;
	}
	/*
	div {
		padding:20px;
		border-radius:1%;
		display:flex;
		flex-direction:column;


		align-items:center;
		justify-content:center;

		background-color:pink;
		max-width:50%;
	}

	 */
</style>
