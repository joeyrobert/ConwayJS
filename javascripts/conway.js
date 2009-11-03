/* Copyright (c) 2009 Joseph Robert. All rights reserved.
 *
 * ConwayJS is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 3.0  of
 * the License, or (at your option) any later version.
 *
 * ConwayJS is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ConwayJS.  If not, see <http://www.gnu.org/licenses/>.
 */

var xSize = 48;
var ySize = 32;
var gridSize = xSize*ySize;
var grid = new Array(gridSize);
var runInterval;

for(i = 0; i < gridSize; i++) {
  grid[i] = false;
}

function gridLocation(x, y) {
  return xSize*y + x;
}

function getX(gridLocation) {
  return gridLocation % xSize;
}

function getY(gridLocation) {
  return Math.floor(gridLocation / xSize);
}

function drawTable(x, y) {
  var html = '<table>';

  for(i = 0; i < y; i++) {
    html += '<tr>';
    for(j = 0; j < x; j++) {
      html += '<td id="' + gridLocation(j, i) + '"></td>';
    }
    html += '</tr>';
  }

  html += '</table>';
  html += '<div id="messages"></div>';
  html += '<div>Import/Export</div>';
  html += '<textarea id="import"></textarea>';
  html += '<p><a href="#" onclick="run(); return false;">Run</a> | ';
  html += '<a href="#" onclick="stop(); return false;">Stop</a> | ';
  html += '<a href="#" onclick="runCycle(); return false;">Step</a> | ';
  html += '<a href="#" onclick="clearScreen(); return false;">Clear</a> | ';
  html += '<a href="#" onclick="exportGrid(); return false;">Export</a> | ';
  html += '<a href="#" onclick="importGrid(); return false;">Import</a></p>';

  document.getElementById("conway").innerHTML = html;
}

function numberOfNeighbors(id, gridToCheck) {
  var neighbors = 0;
  var deltas = [id - xSize - 1, id - xSize, id - xSize + 1, id - 1, id + 1, id + xSize - 1, id + xSize, id + xSize + 1];

  for(var i = 0; i < 8; i++) {
    if(gridToCheck[deltas[i]]) {
      neighbors++;
    }
  }

  return neighbors;
}

function numberOfNeighborsWithList(id, gridToCheck) {
  var neighbors = 0;
  var neighborhood = [];
  var deltas = [id - xSize - 1, id - xSize, id - xSize + 1, id - 1, id + 1, id + xSize - 1, id + xSize, id + xSize + 1];

  for(var i = 0; i < 8; i++) {
    if(gridToCheck[deltas[i]]) {
      neighbors++;
      neighborhood.push(deltas[i]);
    }
  }

  return [neighbors, neighborhood];
}

function runCycle() {
  var neighbors, id, oldGrid;
  oldGrid = grid.slice(0);

  var id = 0;
  $("#conway table td").each(function() {
    neighbors = numberOfNeighbors(id, oldGrid);

    if((neighbors < 2 || neighbors > 3) && oldGrid[id]) {
      $(this).removeClass("on");
      grid[id] = false;
    }
    if(neighbors == 3 && !oldGrid[id]) {
      $(this).addClass("on");
      grid[id] = true;
    }
    id++;
  });
}

function run() {
  runInterval = setInterval(runCycle, 50);
}

function stop() {
  clearInterval(runInterval);
}

function clearScreen() {
  for(var i = 0; i < gridSize; i++) {
    if(grid[i]) {
      grid[i] = false;
      $("#conway table td#" + i).removeClass("on");
    }
  }
}

function exportGrid() {
  var html = "";
  for(var i = 0; i < gridSize; i++) {
    if(grid[i]) {
      html += i + ",";
    }
  }
  html = html.slice(0, html.length - 1);
  $("#conway #import").val(html);
}

function importScreen(importText) {
  if(!importText.match(/(\d+\,)*\d+$/)) {
    $("#conway #messages").html("Not valid input!");
    $("#conway #messages").slideDown("slow");
    return;
  } else {
    $("#conway #messages:visible").slideUp("slow");
  }

  clearScreen();
  var trueSquares = importText.split(",");

  for(i = 0; i < trueSquares.length; i++) {
    $("#conway table td#" + trueSquares[i]).addClass("on");
    grid[trueSquares[i]] = true;
  }
}

function importGrid() {
  var importText = $("#conway #import").val();
  importScreen(importText);
}

$(document).ready(function () {
  drawTable(xSize, ySize);

  $("#conway table td").mousedown(function() {
    $(this).toggleClass("on");

    grid[$(this).attr('id')] = $(this).hasClass("on");
  });
});
