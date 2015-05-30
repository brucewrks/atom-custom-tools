(function() {
	module.exports.activate = function() {
		atom.commands.add('atom-workspace', 'custom-tools:minify', this.minify);
		atom.commands.add('atom-workspace', 'custom-tools:terminal', this.terminal);
	};

	module.exports.consumeToolBar = function(toolBar) {
		this.toolBar = toolBar('custom-tools');

		/* Basic Functions */
		this.toolBar.addButton({
			icon: 'folder-open',
			callback: 'application:open',
			tooltip: 'Open A File',
			iconset: 'fa'
		});

		this.toolBar.addButton({
			icon: 'floppy-o',
			callback: 'window:save-all',
			tooltip: 'Save All',
			iconset: 'fa'
		});

		this.toolBar.addButton({
			icon: 'arrow-left',
			callback: 'core:undo',
			tooltip: 'Undo',
			iconset: 'fa'
		});

		this.toolBar.addButton({
			icon: 'arrow-right',
			callback: 'core:redo',
			tooltip: 'Redo',
			iconset: 'fa'
		});

		this.toolBar.addButton({
			icon: 'list',
			callback: 'tree-view:toggle',
			tooltip: 'Toggle Tree View',
			iconset: 'fa'
		});

		this.toolBar.addSpacer();

		/* Additional Functions */
		this.toolBar.addButton({
			icon: 'indent',
			callback: 'atom-beautify:beautify-editor',
			//callback: 'editor:auto-indent',
			tooltip: 'Reformat File/Selection',
			iconset: 'fa'
		});

		this.toolBar.addButton({
			icon: 'file-archive-o',
			callback: 'custom-tools:minify',
			tooltip: 'Minify JS + CSS',
			iconset: 'fa'
		});

		this.toolBar.addButton({
			icon: 'terminal',
			callback: 'custom-tools:terminal',
			tooltip: 'Open Terminal',
			iconset: 'fa'
		});

		this.toolBar.addSpacer();

		/* Additional Functions */
		this.toolBar.addButton({
			icon: 'refresh',
			callback: 'window:reload',
			tooltip: 'Reload',
			iconset: 'fa'
		});

		this.toolBar.addButton({
			icon: 'wrench',
			callback: 'application:show-settings',
			tooltip: 'Settings',
			iconset: 'fa'
		});

		this.toolBar.addButton({
			icon: 'bug',
			callback: 'window:toggle-dev-tools',
			tooltip: 'Console',
			iconset: 'fa'
		});
	};

	module.exports.minify = function() {
		var directories = atom.project.getDirectories();

		directories.forEach(function(dir) {
			var realPath = dir.realPath || dir.path;
			var min = require('child_process').exec('/usr/local/bin/ws min ' + realPath);
		});
	};

	module.exports.terminal = function() {
		var directories = atom.project.getDirectories();

		var realPath = directories[0].realPath || directories[0].path;

		var osascripts = [
			'tell application "iTerm" to activate',
			'tell application "System Events" to keystroke "n" using command down',
			'tell application "iTerm" to tell session -1 of current terminal to write text "cd ' + realPath + '"',
			'tell application "iTerm" to tell session -1 of current terminal to write text "clear"'
		];

		var i = 0;
		var doProcess = function(command) {
			var process = require('child_process').exec('/usr/bin/osascript -e \'' + command + '\'',
				function(err, stdout, stderr) {
					console.log(arguments);

					if (i + 1 === osascripts.length) return;
					doProcess(osascripts[++i]);
				}
			);
		};

		doProcess(osascripts[0]);
	};
})();
