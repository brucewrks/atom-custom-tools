let toolbar;

module.exports.consumeToolBar = function(getToolBar) {
  toolBar = getToolBar('custom-tools');

  /* Basic Functions */
  toolBar.addButton({
    icon: 'folder-open',
    callback: 'application:open',
    tooltip: 'Open A File',
    iconset: 'fa'
  });

  toolBar.addButton({
    icon: 'floppy-o',
    callback: 'window:save-all',
    tooltip: 'Save All',
    iconset: 'fa'
  });

  toolBar.addButton({
    icon: 'arrow-left',
    callback: 'core:undo',
    tooltip: 'Undo',
    iconset: 'fa'
  });

  toolBar.addButton({
    icon: 'arrow-right',
    callback: 'core:redo',
    tooltip: 'Redo',
    iconset: 'fa'
  });

  toolBar.addButton({
    icon: 'list',
    callback: 'tree-view:toggle',
    tooltip: 'Toggle Tree View',
    iconset: 'fa'
  });

  toolBar.addSpacer();

  /* Additional Functions */
  toolBar.addButton({
    icon: 'indent',
    callback: 'custom-tools:beautify',
    tooltip: 'Reformat File/Selection',
    iconset: 'fa'
  });

  toolBar.addButton({
    icon: 'file-archive-o',
    callback: 'custom-tools:minify',
    tooltip: 'Minify JS + CSS',
    iconset: 'fa'
  });

  toolBar.addButton({
    icon: 'terminal',
    callback: 'custom-tools:terminal',
    tooltip: 'Open Terminal',
    iconset: 'fa'
  });

  toolBar.addSpacer();

  /* Additional Functions */
  toolBar.addButton({
    icon: 'refresh',
    callback: 'window:reload',
    tooltip: 'Reload',
    iconset: 'fa'
  });

  toolBar.addButton({
    icon: 'wrench',
    callback: 'application:show-settings',
    tooltip: 'Settings',
    iconset: 'fa'
  });

  toolBar.addButton({
    icon: 'bug',
    callback: 'window:toggle-dev-tools',
    tooltip: 'Console',
    iconset: 'fa'
  });
};

module.exports.beautify = function() {
  var editor = atom.workspace.getActiveTextEditor(),
    file = editor.getPath();

  if (file.indexOf('php', file.length - 3) === -1)
    atom.commands.dispatch(atom.views.getView(editor), 'atom-beautify:beautify-editor');
  else require('child_process').exec('/usr/local/bin/php /Users/bruce/beautify/beautify.php ' + file);
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
        if (i + 1 === osascripts.length) return;
        doProcess(osascripts[++i]);
      }
    );
  };

  doProcess(osascripts[0]);
};
