const Quill = require('quill');

var events = (function () {
  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function (topic, listener) {
      // Create the topic's object if not yet created
      if(!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) -1;

      // Provide handle back for removal of topic
      return {
        remove: function() {
          delete topics[topic][index];
        }
      };
    },
    publish: function (topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if (!hOP.call(topics, topic)) return;

      // Cycle through topics queue, fire!
      topics[topic].forEach(function(item) {
        item(info != undefined ? info : {});
      });
    }
  };
})();
// find all the divs that need editors and add them
var EditableField = function (config) {
  var title;
  var info;
  var elm;
  var editor;
  var init = function (c) {
    title = c.title;
    info = JSON.parse(c.info);
    elm = document.getElementById(title);
    if (info.type === 'fullHTML') {
      editor = new Quill(elm, {
        theme: 'snow'
      });
    } else { // simple edit field
      editor = new Quill(elm, {
        theme: 'snow',
        modules: {
          // Equivalent to { toolbar: { container: '#toolbar' }}
          toolbar: false
        }
      });
    }
    editor.setContents(info.delta);
    editor.on('text-change', function(delta, oldDelta, source) {
      events.publish('needsave', {
        title: title
      });
    });
  };
  var exportData = function () {
    // html h1 id tag fix
    var h1s = Array.from(elm.querySelectorAll('h1'));
    h1s.map((h1) => {
      var h1ID = h1.textContent.toLowerCase();
      var cleanId = h1ID.replace(/\s/g, '_');
      cleanId = encodeURIComponent(cleanId);
      console.log({cleanId: cleanId});
      h1.setAttribute('id', cleanId);
    });
    return {
      delta: editor.getContents(),
      html: info.type === 'fullHTML' ? elm.querySelector('.ql-editor').innerHTML : elm.querySelector('.ql-editor').textContent,
      title: title
    };
  };
  init(config);
  return {
    init: init,
    info: info,
    exportData: exportData
  };
};

var fieldElms = Array.from(document.querySelectorAll('*[data-field]'));
var editableFields = fieldElms.map((elm) => {
  var config = {
    info: elm.getAttribute('data-field'),
    title: elm.getAttribute('id')
  };
  var f = new EditableField(config);
  return f;
});
document.querySelector('*[data-save]').addEventListener('click', function() {
  document.querySelector('*[data-save]').classList.add('updateing');
  var saveData = editableFields.reduce((arr, editableField) => {
    arr.push(editableField.exportData());
    return arr;
  }, []);
  fetch ('/edit', {
    method: 'put',
    body: JSON.stringify(saveData),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(()=> {
    console.log('changes saved');
    document.querySelector('*[data-save]').classList.remove('needssave');
    document.querySelector('*[data-save]').classList.remove('updateing');
  });
});
var savSub = events.subscribe('needsave', function(title) {
  console.log(title + ' needs update');
  document.querySelector('*[data-save]').classList.add('needssave');
});

document.querySelector('*[data-update]').addEventListener('click', function () {
  document.querySelector('*[data-update]').classList.add('updateing');
  fetch ('/edit/update', {
    method: 'get'
  })
  .then(()=> {
    console.log('changes saved');
    document.querySelector('*[data-update]').classList.remove('updateing');
  });
});

console.log({editableFields: editableFields});
