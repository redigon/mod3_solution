(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchSService', MenuSearchSService)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
.directive('foundItems',foundItemsDirective);

NarrowItDownController.$inject = ['MenuSearchSService'];
function NarrowItDownController(MenuCategoriesService) {
  var list = this;
  list.filterstring = "";
  list.found = [];
  list.notfound = false;

  list.GetItems = function (searchTerm) {
    if(searchTerm == "") {  list.found=[];list.notfound = true;console.log("list.notfound = "+list.notfound);
         return;
     }

    var promise = MenuCategoriesService.getMatchedMenuItems(searchTerm);
    promise.then(function (response) {
      list.found = response;

      //Message not found
      if(list.found.length>0) list.notfound = false;
      else list.notfound = true;

    })
    .catch(function (error) {
      console.log(error);
    })
  };


  list.removeItem = function (itemIndex) {
    list.found.splice(itemIndex, 1);
    if(list.found.length>0) list.notfound = false;
    else list.notfound = true;
    console.log("list.notfound = "+list.notfound);
  };
}

MenuSearchSService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchSService($http, ApiBasePath) {
  var service = this;


  service.getMatchedMenuItems = function(searchTerm)
  {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
    })
    .then(function (result) {
    // process result and only keep items that match

    var unfilteredlist = result.data.menu_items;
     var foundItems = [];
      for (var i = 0; i < unfilteredlist.length; i++) {
        var name = unfilteredlist[i].description;
        if (name.toLowerCase().indexOf(searchTerm) !== -1) {
          foundItems.push(unfilteredlist[i]);
        }
      }
    // return processed items
    return foundItems;
});

  }

}

function foundItemsDirective() {
  var ddo = {
    templateUrl: 'itemList.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: foundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function foundItemsDirectiveController() {
  var list = this;

  list.itemsInList = function () {
console.log("itemsInList function is called:"+ list.items.length);
    if(list.items.length<1) return true;

    return false;
  };
}

})();
