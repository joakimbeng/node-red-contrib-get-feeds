import test from 'ava';
import getFeedsNode from '../src/get-feeds';

const red = (config = {}) => {
	const _registered = new Map();
	const _listeners = new Map();
	const _receivers = [];
	return {
		nodes: {
			createNode(node) {
				node.on = (evt, cb) => {
					_listeners.set(evt, cb);
				};
				node.send = msg => {
					_receivers.forEach(cb => cb(msg));
					_receivers.length = 0;
				};
			},
			registerType(name, Node) {
				_registered.set(name, new Node(config));
			}
		},
		_registered,
		_listeners,
		_emit(evt, msg) {
			if (_listeners.has(evt)) {
				return _listeners.get(evt)(msg);
			}
		},
		_receive() {
			return new Promise(resolve => {
				_receivers.push(resolve);
			});
		}
	};
};

test('type is registered', t => {
	const RED = red();
	getFeedsNode(RED);
	t.truthy(RED._registered.has('get-feeds'));
});

test('sends msg on input', async t => {
	const RED = red();
	getFeedsNode(RED);
	const msg = {
		payload: '<html>Lorem ipsum</html>'
	};
	const receiver = RED._receive();
	RED._emit('input', msg);
	const newMsg = await receiver;
	t.truthy(newMsg);
	t.truthy(newMsg.payload);
	t.is(newMsg.payload, msg.payload);
});

test('includes found feeds in payload', async t => {
	const RED = red();
	getFeedsNode(RED);
	const msg = {
		payload: `
			<html>
				<link rel="alternate" type="text/rss" href="http://example.com/rss">
				Lorem ipsum
			</html>
		`
	};
	const receiver = RED._receive();
	RED._emit('input', msg);
	const newMsg = await receiver;
	t.truthy(newMsg);
	t.truthy(Array.isArray(newMsg.feeds));
	t.is(newMsg.feeds.length, 1);
	t.is(newMsg.feeds[0].href, 'http://example.com/rss');
});

test('uses url from input as baseUrl', async t => {
	const RED = red();
	getFeedsNode(RED);
	const msg = {
		url: 'http://example.com',
		payload: `
			<html>
				<link rel="alternate" type="text/rss" href="/rss">
				Lorem ipsum
			</html>
		`
	};
	const receiver = RED._receive();
	RED._emit('input', msg);
	const newMsg = await receiver;
	t.truthy(newMsg);
	t.truthy(Array.isArray(newMsg.feeds));
	t.is(newMsg.feeds.length, 1);
	t.is(newMsg.feeds[0].href, 'http://example.com/rss');
});

test('oneFeedPerMsg', async t => {
	const RED = red({oneFeedPerMsg: true});
	getFeedsNode(RED);
	const msg = {
		url: 'http://example.com',
		payload: `
			<html>
				<link rel="alternate" type="text/rss" href="/rss">
				<link rel="alternate" type="text/atom" href="/atom">
				Lorem ipsum
			</html>
		`
	};
	const receiver = RED._receive();
	RED._emit('input', msg);
	const [messages] = await receiver;
	t.truthy(Array.isArray(messages));
	t.is(messages.length, 2);
	t.is(messages[0].feed.href, 'http://example.com/rss');
	t.is(messages[1].feed.href, 'http://example.com/atom');
});

test.cb('oneFeedPerMsg no feed found', t => {
	const RED = red({oneFeedPerMsg: true});
	getFeedsNode(RED);
	const msg = {
		url: 'http://example.com',
		payload: `
			<html>
				Lorem ipsum
			</html>
		`
	};
	const receiver = RED._receive();
	RED._emit('input', msg);
	receiver
		.then(() => t.fail('No message should have been emitted'))
		.catch(err => t.end(err));

	setTimeout(() => t.end(), 1);
});
