var menus = [
  { 
    id: "Home",
    title: "Home",
    url: "/"
  },
  { 
    id: "Torrent",
    title: "Torrent",
    url: "/torrent/",
    submenu: [ 
      { id: "Torrent-Add",
        title: "add",
        url: "/torrent/add"
      },
      { id: "Torrent-List",
        title: "list",
        url: "/torrent/list"
      }
    ]
  },
  { 
    id: "Menu2",
    title: "Menu2",
    url: "/menu2"
  }
];

function getMenus(current) {
  for (key in menus) {
    menus[key].active = menus[key].title == current;
  }
  return menus;
}

module.exports.getMenus = getMenus;
