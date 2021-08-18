import EditorState from '../../entity/EditorState';
import Zone from '../../entity/Zone';
import { readContent } from '../utils';
import './dropZone.css';

let dragTimeout: NodeJS.Timeout = undefined;
let dropZone = document.getElementById('dropZone');

function onDragOver(e: DragEvent) {
  e.preventDefault();

  console.log(e);

  dropZone.classList.add('currentDrop');

  if (dragTimeout) {
    clearTimeout(dragTimeout);
  }
  dragTimeout = setTimeout(() => {
    dropZone.classList.remove('currentDrop');
  }, 100);
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();

  if (e.dataTransfer.items) {
    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      if (e.dataTransfer.items[i].kind === 'file') {
        let file = e.dataTransfer.items[i].getAsFile();
        addFile(file);
      }
    }
  } else {
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      addFile(e.dataTransfer.files[i]);
    }
  }
}

function addFile(file: File) {
  if (file.type !== 'image/svg+xml') {
    return;
  }

  let id = file.name.split('.')[0].replace(/ /g, '-');

  if (!EditorState.isAvailableIdZone(id)) {
    let i = 0;

    while (!EditorState.isAvailableIdZone(id + '-' + i)) {
      i++;
    }

    id = id + '-' + i;
  }

  readContent(file).then((b64: string) => {
    EditorState.addZone(new Zone(id, file, b64, 0, 0, 50, undefined));
  });
}

dropZone.addEventListener('dragover', onDragOver);
dropZone.addEventListener('drop', onDrop);
