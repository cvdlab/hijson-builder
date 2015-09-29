function main () {

  var project = new Project();

  var plane_w = 60;
  var plane_h = 90;
  var area_w = 20;
  var area_h = 80;
  var room_w = 20;
  var room_h = 10;
  var bath_w = 5;
  var bath_h = 4;
  var corridor_w = 20;

  var level = project.create_level({ width: plane_w, height: plane_h });

  [1,2].forEach(function (i_area) {
    var odd_area = i_area % 2 == 0;

    var area = project.create_room({ width: room_w, height: area_h, parent: level });
    if (odd_area) { area.translate({ x: area_w + corridor_w }); }

    [0,1,2,3,4,5,6,7,8].forEach(function (i_room) {
      var odd_room = i_room % 2 !== 0;

      var room;
      var bath;
      var wall;

      room = project.create_room({ width: room_w, height: room_h, parent: area });
      room.translate({ y: room.height * i_room });

      wall = project.create_wall_north({ room: room, parent: area });

      wall = project.create_wall_west({ room: room, parent: area });

      wall = project.create_wall_east({ room: room, parent: area });

      bath = project.create_room({ width: bath_w, height: bath_h, parent: room });
      if (!odd_area) { bath.translate({ x: room.width - bath.width }); }
      if (odd_room) { bath.translate({ y: room.height - bath.height }); }

      if (odd_room) {
        wall = project.create_wall_south({ room: bath, parent: area });
      }
      else {
        wall = project.create_wall_north({ room: bath, parent: area });
      }

      if (odd_area) {
        wall = project.create_wall_east({ room: bath, parent: area });
      } else {
        wall = project.create_wall_west({ room: bath, parent: area });
      }
    });
  });

  var output = project.print();
  var pre = document.getElementById('output');
  pre.innerText = output;
}

main();
