const uuidv4 = require('uuid').v4;
const OktaJwtVerifier = require('@okta/jwt-verifier');
const okta = require('@okta/okta-sdk-nodejs');

const jwtVerifier = new OktaJwtVerifier({
	clientId: '0oa3ib6wrknOyYdli5d7',
	issuer: 'https://dev-7085585.okta.com/oauth2/default',
});

const oktaClient = new okta.Client({
	orgUrl: 'https://dev-7085585.okta.com',
	token: '00r6zbF_bH4XskFWrbv4KGAsSk1uFKvaxnesV6tUyH',
});

async function authHandler(socket, next) {
	const { token = null } = socket.handshake.query || {};
	if (token) {
		try {
			const [authType, tokenValue] = token.trim().split(' ');
			if (authType !== 'Bearer') {
				throw new Error('Expected a Bearer token');
			}

			const {
				claims: { sub },
			} = await jwtVerifier.verifyAccessToken(tokenValue, 'api://default');
			const user = await oktaClient.getUser(sub);

			users.set(socket, {
				id: user.id,
				name: [user.profile.firstName, user.profile.lastName]
					.filter(Boolean)
					.join(' '),
			});
		} catch (error) {
			console.log(error);
		}
	}

	next();
}

const messages = new Set();
const users = new Map();

const defaultUser = {
	id: 'anon',
	name: 'Anonymous',
};

const messageExpirationTimeMS = 5 * 60 * 1000;

class Connection {
	constructor(io, socket) {
		this.socket = socket;
		this.io = io;

		socket.on('getMessages', () => this.getMessages());
		socket.on('message', ({ value, user }) =>
			this.handleMessage({ value, user })
		);
		socket.on('disconnect', () => this.disconnect());
		socket.on('connect_error', (err) => {
			console.log(`connect_error due to ${err.message}`);
		});
	}

	sendMessage(message) {
		this.io.sockets.emit('message', message);
	}

	getMessages() {
		messages.forEach((message) => this.sendMessage(message));
	}

	handleMessage({ value, user }) {
		console.log('get new message', value, user);
		const message = {
			id: uuidv4(),
			user,
			value,
			time: Date.now(),
		};

		messages.add(message);
		this.sendMessage(message);

		setTimeout(() => {
			messages.delete(message);
			this.io.sockets.emit('deleteMessage', message.id);
		}, messageExpirationTimeMS);
	}

	disconnect() {
		console.log('disconnect');
		users.delete(this.socket);
	}
}

function chat(io) {
	io.use(authHandler);
	io.on('connection', (socket) => {
		new Connection(io, socket);
		console.log('new connection');
	});
}

module.exports = chat;
