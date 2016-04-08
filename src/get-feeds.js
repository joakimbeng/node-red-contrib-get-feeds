'use strict';
const getFeeds = require('get-feeds');

module.exports = exports = function (RED) {
	function GetFeedsNode(config) {
		RED.nodes.createNode(this, config);
		this.oneFeedPerMsg = Boolean(config.oneFeedPerMsg);
		this.on('input', msg => {
			const html = msg.payload;
			const url = msg.url;
			const feeds = getFeeds(html, {url});
			if (this.oneFeedPerMsg) {
				if (feeds.length) {
					this.send([feeds.map(feed => Object.assign({}, msg, {feed}))]);
				}
			} else {
				this.send(Object.assign({}, msg, {feeds}));
			}
		});
	}
	RED.nodes.registerType('get-feeds', GetFeedsNode);
};
