/**
 * Model
 */

function Model (options) {
  this._class = 'model';
  this.children = [];
  this.x = 0;
  this.y = 0;
  if (options.parent) {
    options.parent.add(this);
  }
}

Model.prototype.get_id = function () {
  var parts = [];
  var current = this;
  var parent;
  if (!current.parent) {
    return this._class;
  }
  while (current.parent) {
    var children = current.parent.children.filter(function (object) {
      return object._class == current._class;
    });
    var index = children.indexOf(current);
    parts.unshift(current._class + '_' + index);
    current = current.parent;
  }
  var id = parts.join('/');
  return id;
};

Model.prototype.get_position = function () {
  var x = 0//this.x + (this.parent ? this.parent.x : 0);
  var y = 0//this.y + (this.parent ? this.parent.y : 0);
  var position = {
    x: x,
    y: y
  };
  return position;
};

Model.prototype.get_absolute_position = function () {
  var current = this;
  var x = current.x;
  var y = current.y;
  while (current = current.parent) {
    x += current.x;
    y += current.y;
  }
  var position = {
    x: x,
    y: y
  };
  return position;
};

Model.prototype.translate = function (offset) {
  this.x += offset.x || 0;
  this.y += offset.y || 0;
};

Model.prototype.add = function (object) {
  this.children.push(object);
  object.parent = this;
};

Model.prototype.to_json = function () {
  var _class = this._class;
  var id = this.get_id();
  var position = this.get_position();
  var x = position.x;
  var y = position.y;
  var parent = (this.parent && this.parent.get_id()) || 'building';

  var json = {
    type: 'Feature',
    id: id,
    geometry: {},
    properties: {
      'class': _class,
      parent: parent,
      description: id,
      height: 3.5,
      thickness: 0.1,
      tVector: [x, y, 0],
      rVector: [0, 0, 0]
    }
  };

  return json;
};


/**
 * Room
 */

function Room (options) {
  Model.call(this, options);
  this._class = 'room';
  this.parent = options.parent;
  this.width = options.width;
  this.height = options.height;
}

Room.prototype = Object.create(Model.prototype);
Room.prototype.constructor = Room;

Room.prototype.get_dimensions = function () {
  var dimensions = { width: this.width, height: this.height };
  return dimensions;
}

Room.prototype.to_json = function () {
  var json = Model.prototype.to_json.call(this);
  var dimensions = this.get_dimensions();
  var w = dimensions.width;
  var h = dimensions.height;
  json.geometry = {
    type: 'Polygon',
    coordinates: [
      [ [0, 0], [w, 0], [w, h], [0, h], [0, 0] ]
    ]
  };
  json.properties.class = 'room';
  return json;
}

/**
 * Plane
 */

function Level (options) {
  Room.call(this, options);
}

Level.prototype = Object.create(Room.prototype);
Level.prototype.constructor = Level;

Level.prototype.to_json = function () {
  var json = Room.prototype.to_json.call(this);

  json.properties.class = 'level';

  return json;
};

/**
 * Wall
 */

function Wall (options) {
  Model.call(this, options);
  this._class = 'internal_wall';
  this.thickness = 0.1;
  this.room = options.room;
  this.orientation = options.orientation || 'north';
}

Wall.prototype = Object.create(Model.prototype);
Wall.prototype.constructor = Wall;

Wall.prototype.get_id = function () {
  var parts = [];
  parts.push(this.room.get_id());
  parts.push(this._class + '_' + this.orientation);
  var id = parts.join('/');
  return id;
};

Wall.prototype.get_lenght = function () {
  if (this.orientation == 'north' || this.orientation == 'south') {
    return this.room.width;
  }
  return this.room.height;
};

Wall.prototype.get_position = function () {
  var position = this.room.get_absolute_position();
  if (this.orientation == 'north') {
    position.y += this.room.height;
  }
  if (this.orientation == 'east') {
    position.x += this.room.width;
  }
  return position;
};

Wall.prototype.get_rotation = function () {
  if (this.orientation == 'east' || this.orientation == 'west') {
    return 90;
  }
  return 0;
};

Wall.prototype.to_json = function () {
  var json = Model.prototype.to_json.call(this);
  var w = this.get_lenght();
  var a = this.get_rotation();

  json.geometry = {
    type: 'LineString',
    coordinates: [
      [0, 0], [w, 0]
    ]
  };
  json.properties.thickness = this.thickness;
  json.properties.class = this._class;
  json.properties.rVector[2] = a;
  json.properties.connections = [this.room.get_id()];

  return json;
}

/**
 * WallNorth
 */

function WallNorth (options) {
  Wall.call(this, options);
  this.orientation = 'north';
}

WallNorth.prototype = Object.create(Wall.prototype);
WallNorth.prototype.constructor = WallNorth;

/**
 * WallEast
 */

function WallEast (options) {
  Wall.call(this, options);
  this.orientation = 'east';
}

WallEast.prototype = Object.create(Wall.prototype);
WallEast.prototype.constructor = WallEast;

/**
 * WallSouth
 */

function WallSouth (options) {
  Wall.call(this, options);
  this.orientation = 'south';
}

WallSouth.prototype = Object.create(Wall.prototype);
WallSouth.prototype.constructor = WallSouth;

/**
 * WallWest
 */

function WallWest (options) {
  Wall.call(this, options);
  this.orientation = 'west';
}

WallWest.prototype = Object.create(Wall.prototype);
WallWest.prototype.constructor = WallWest;

/**
 * WallExternal
 */

function WallExternal (options) {
  Wall.call(this, options);
  this._class = 'external_wall';
  this.thickness = 0.3;
}

WallExternal.prototype = Object.create(Wall.prototype);
WallExternal.prototype.constructor = WallExternal;


/**
 * Door
 */

function Door (options) {
  Model.call(this, options);
  this._class = 'door';
}

Door.prototype = Object.create(Model.prototype);
Door.prototype.constructor = Door;

Door.prototype.get_position = function () {
  var x = this.x + (this.parent ? this.parent.x : 0);
  var y = this.y + (this.parent ? this.parent.y : 0);
  var position = {
    x: x,
    y: y
  };
  return position;
};

Door.prototype.to_json = function () {
  var json = Model.prototype.to_json.call(this);

  json.geometry = {
    type: 'LineString',
    coordinates: [
      [0, 0], [1, 0]
    ]
  };
  json.properties.class = 'door';

  return json;
}

/**
 * Project
 */

function Project () {
  this.objects = [];
}

Project.prototype.add = function (model) {
  this.objects.push(model);
};

Project.prototype.to_json = function () {
  var json = {
    id: 'architectures',
    type: 'FeatureCollection',
    features: []
  };

  this.objects.forEach(function (object) {
    json.features.push(object.to_json());
  });
  return json;
};

Project.prototype.print = function () {
  var json = this.to_json();
  var text = JSON.stringify(json, null, '\t');
  return text;
};

Project.prototype.create_level = function (options) {
  var level = new Level(options);
  this.add(level);
  return level;
};

Project.prototype.create_room = function (options) {
  var room = new Room(options);
  this.add(room);
  return room;
};

Project.prototype.create_wall = function (options) {
  var wall = new Wall(options);
  this.add(wall);
  return wall;
};

Project.prototype.create_wall_north = function (options) {
  var wall = new WallNorth(options);
  this.add(wall);
  return wall;
};

Project.prototype.create_wall_east = function (options) {
  var wall = new WallEast(options);
  this.add(wall);
  return wall;
};

Project.prototype.create_wall_south = function (options) {
  var wall = new WallSouth(options);
  this.add(wall);
  return wall;
};

Project.prototype.create_wall_west = function (options) {
  var wall = new WallWest(options);
  this.add(wall);
  return wall;
};

Project.prototype.create_door = function (options) {
  var door = new Door(options);
  this.add(door);
  return door;
};

Project.prototype.create_wall_external = function (options) {
  var wall = new WallExternal(options);
  this.add(wall);
  return wall;
};

