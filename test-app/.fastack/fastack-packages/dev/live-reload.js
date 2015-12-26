(function(){
	// Inject socket.io client script (served by local server)
	var liveReload = document.createElement('script');
	liveReload.setAttribute('src','/socket.io/socket.io.js');
	document.head.appendChild(liveReload);

	liveReload.onload = function() {
		var socket = io(window.location.origin);

		socket.on('reload', function() {
			location.reload();
		});

		socket.on('reload-css', function() {
			// https://github.com/dbashford/mimosa-live-reload/blob/master/lib/assets/reload-client.js
			setTimeout(function(){
				var links = document.getElementsByTagName("link");
				for (var i = 0; i < links.length; i++) {
					var tag = links[i];
					if (tag.rel.toLowerCase().indexOf("stylesheet") >= 0 && tag.href) {
						var newHref = tag.href.replace(/(&|%5C?)\d+/, "");
						tag.href = newHref + (newHref.indexOf("?") >= 0 ? "&" : "?") + (new Date().valueOf());
					}
				}
			}, 150)
		})
	}

})();