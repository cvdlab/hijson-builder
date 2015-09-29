function main () {

  var project = new Project();

  var plane_w = 22.5;
  var plane_h = 30;
  var area_w = 7.5;
  var area_h = 30;
  var room_w = 7.5;
  var room_h = 3.75;
  var bath_w = 3;
  var bath_h = 1.875;
  var corridor_w = 7.5;
  var d_offset = 0.4375;

  var level = project.create_level({ width: plane_w, height: plane_h });
 

  [1,2].forEach(function (i_area) {
    var odd_area = i_area % 2 == 0;

    var area = project.create_room({ width: room_w, height: area_h, parent: level });
    if (odd_area) { area.translate({ x: area_w + corridor_w }); }

    //crea i muri a sud delle 2 aree
    wall = project.create_wall_external({ room: area, parent: level, orientation: 'north' });
    wall = project.create_wall_external({ room: area, parent: level, orientation: 'south' });
    if (!odd_area) {
      wall = project.create_wall_external({ room: area, parent: level, orientation: 'west' });
    }
    else { 
      wall = project.create_wall_external({ room: area, parent: level, orientation: 'east' });
    }

    [0,1,2,3,4,5,6,7].forEach(function (i_room) {
      var odd_room = i_room % 2 !== 0;

      var room;
      var bath;
      var wall;
      var door;
      

      room = project.create_room({ width: room_w, height: room_h, parent: area });
      room.translate({ y: room.height * i_room });

      wall = project.create_wall_north({ room: room, parent: area });

      wall = project.create_wall_west({ room: room, parent: area });

      if (odd_area){
      door = project.create_door({ parent: wall });
        if (!odd_room) { door.translate({ x: room.height / 2 + d_offset }); }
        else  door.translate({ x: d_offset });
      }

      wall = project.create_wall_east({ room: room, parent: area });

     if (!odd_area) {
      door = project.create_door({ parent: wall });
        if (odd_room) { door.translate({ x: d_offset }); }
        else door.translate({ x: room.height / 2 + d_offset });
     }

      bath = project.create_room({ width: bath_w, height: bath_h, parent: room });
      if (!odd_area) { bath.translate({ x: room.width - bath.width }); }
      if (odd_room) { bath.translate({ y: room.height - bath.height }); }

      if (odd_room) {
        wall = project.create_wall_south({ room: bath, parent: area });
      }
      else {
        wall = project.create_wall_north({ room: bath, parent: area });
      }

      door = project.create_door({ parent: wall });
      door.translate({ x: bath_w / 3 });


      if (odd_area) {
        wall = project.create_wall_east({ room: bath, parent: area });
      } 
      else {
        wall = project.create_wall_west({ room: bath, parent: area });
      }

/*
     
*/
    });
  });

//crea il corridoio 
      room = project.create_room({ width: corridor_w, height: plane_h, parent: level });
      room.translate({ x: room_w });

      wall = project.create_wall_external({ room: room, parent: level, orientation: 'north' });
      door = project.create_door({ parent: wall});
      door.translate({ x: (room_w - 3.5) / 2 });
      door = project.create_door({ parent: wall});
      door.translate({ x: (room_w - 1.5) / 2 + 1.5 });

      wall = project.create_wall_external({ room: room, parent: level, orientation: 'south' });
      door = project.create_door({ parent: wall});
      door.translate({ x: (room_w - 3.5) / 2 });
      door = project.create_door({ parent: wall});
      door.translate({ x: (room_w - 1.5) / 2 + 1.5 });

/*
*
  CENTRAL ROOMS 
*/

  //SOUTH

      //south room
      room = project.create_room({ width: 3.375, height: room_h, parent: level});
      room.translate({ x: room_w + (room_w - room.width) / 2 });
      room.translate({ y: bath_h });
      wall = project.create_wall_north({ room: room, parent: room });
      wall = project.create_wall_east({ room: room, parent: room });
      wall = project.create_wall_west({ room: room, parent: room });
      wall = project.create_wall_south({ room: room, parent: room });
      door = project.create_door({ parent: wall });
      door.translate({ x: (room.width - 1) / 2  });

      //central n1
      room = project.create_room({ width: 3.375, height: bath_h, parent: level});
      room.translate({ x: room_w + (room_w - room.width) / 2 });
      room.translate({ y: bath_h + room_h });
      wall = project.create_wall_north({ room: room, parent: room });
      wall = project.create_wall_east({ room: room, parent: room });
      wall = project.create_wall_west({ room: room, parent: room });
      door = project.create_door({ parent: wall });
      door.translate({ x: (room.height - 1) / 2  });

      //central n2
      room = project.create_room({ width: 3.375, height: bath_h, parent: level});
      room.translate({ x: room_w + (room_w - room.width) / 2 });
      room.translate({ y: 2 * bath_h + room_h });
      wall = project.create_wall_north({ room: room, parent: room });
      wall = project.create_wall_east({ room: room, parent: room });
      wall = project.create_wall_west({ room: room, parent: room });
      door = project.create_door({ parent: wall });
      door.translate({ x: (room.height - 1) / 2  });
     
      //north room east
      room = project.create_room({ width: 1.6875, height: room_h, parent: level});
      room.translate({ x: room_w + (room_w - 2 * room.width) / 2 });
      room.translate({ y: 3 * bath_h + room_h  });
      wall = project.create_wall_north({ room: room, parent: room });
      door = project.create_door({ parent: wall });
      door.translate({ x: (room.width - 1) / 2  });
      wall = project.create_wall_east({ room: room, parent: room });
      wall = project.create_wall_west({ room: room, parent: room });

      //north room west
      room = project.create_room({ width: 1.6875, height: room_h, parent: level});
      room.translate({ x: room_w + (room_w - 2 * room.width) / 2  + room.width });
      room.translate({ y: 3 * bath_h + room_h  });
      wall = project.create_wall_north({ room: room, parent: room });
      door = project.create_door({ parent: wall });
      door.translate({ x: (room.width - 1) / 2  });
      wall = project.create_wall_east({ room: room, parent: room });
      wall = project.create_wall_west({ room: room, parent: room });
      
  //NORTH

      //south room west
      room = project.create_room({ width: 1.6875, height: room_h, parent: level});
      room.translate({ x: room_w + (room_w - 2 * room.width) / 2 });
      room.translate({ y: bath_h + 4 * room_h  });
      wall = project.create_wall_south({ room: room, parent: room });
      door = project.create_door({ parent: wall });
      door.translate({ x: (room.width - 1) / 2  });
      wall = project.create_wall_east({ room: room, parent: room });
      wall = project.create_wall_west({ room: room, parent: room });

      //south room east
      room = project.create_room({ width: 1.6875, height: room_h, parent: level});
      room.translate({ x: room_w + (room_w - 2 * room.width) / 2 + room.width });
      room.translate({ y: bath_h + 4 * room_h });
      wall = project.create_wall_south({ room: room, parent: room });
      door = project.create_door({ parent: wall });
      door.translate({ x: (room.width - 1) / 2  });
      wall = project.create_wall_east({ room: room, parent: room });
      wall = project.create_wall_west({ room: room, parent: room });

      //central n1
      room = project.create_room({ width: 3.375, height: bath_h, parent: level});
      room.translate({ x: room_w + (room_w - room.width) / 2  });
      room.translate({ y: 5 * room_h + bath_h });
      wall = project.create_wall_south({ room: room, parent: room });
      wall = project.create_wall_east({ room: room, parent: room });
      door = project.create_door({ parent: wall });
      door.translate({ x: (room.height - 1) / 2  });
      wall = project.create_wall_west({ room: room, parent: room });
      
      //central n2
      room = project.create_room({ width: 3.375, height: bath_h, parent: level});
      room.translate({ x: room_w + (room_w - room.width) / 2  });
      room.translate({ y: 6 * room_h });
      wall = project.create_wall_south({ room: room, parent: room });
      wall = project.create_wall_east({ room: room, parent: room });
      door = project.create_door({ parent: wall });
      door.translate({ x: (room.height - 1) / 2  });
      wall = project.create_wall_west({ room: room, parent: room });;

      //north room
      room = project.create_room({ width: 3.375, height: room_h, parent: level});
       room.translate({ x: room_w + (room_w - room.width) / 2  });
      room.translate({ y: 6 * room_h + bath_h });;
      wall = project.create_wall_north({ room: room, parent: room });
      door = project.create_door({ parent: wall });
      door.translate({ x: (room.width - 1) / 2  });

      wall = project.create_wall_east({ room: room, parent: room });
      wall = project.create_wall_west({ room: room, parent: room });
      wall = project.create_wall_south({ room: room, parent: room });
   

  var output = project.print();
  var pre = document.getElementById('output');
  pre.innerText = output;
}

main();
