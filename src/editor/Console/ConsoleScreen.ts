import './ConsoleScreen.css';
import interact from 'interactjs';
import EditorState from '../../entity/EditorState';

let screen = document.getElementById('consoleScreen') as HTMLDivElement;

interact('.zone')
  .draggable({
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
      }),
    ],

    listeners: {
      move(event) {
        var target = event.target;
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },

      end(event) {
        let x =
          ((event.client.x - screen.clientLeft) / screen.clientWidth) * 100;
        let y =
          ((event.client.y - screen.clientTop) / screen.clientHeight) * 100;

        let zone = EditorState.getZoneById(
          event.target.getAttribute('id').replace('zone-', '')
        );

        zone.x = x;
        zone.y = y;
      },
    },
  })
  .resizable({
    edges: { left: true, right: true, bottom: true, top: true },

    listeners: {
      move(event) {
        var target = event.target;
        var x = parseFloat(target.getAttribute('data-x')) || 0;
        var y = parseFloat(target.getAttribute('data-y')) || 0;

        target.style.width = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.transform = 'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      end(event) {
        let zone = EditorState.getZoneById(
          event.target.getAttribute('id').replace('zone-', '')
        );

        zone.height = (event.rect.height / screen.clientHeight) * 100;
        zone.width = (event.rect.width / screen.clientWidth) * 100;

        console.log(zone);
      },
    },
    modifiers: [
      interact.modifiers.restrictEdges({
        outer: 'parent',
      }),
    ],

    inertia: true,
  });
