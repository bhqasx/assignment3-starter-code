(function () {
    'use strict';
    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowDownCtrl)
    .service('MenuSearchService',MenuSearchService)
    .directive('foundItems',foundItemsDirective);

    function foundItemsDirective(){
        var ddo = {
            //由于templateUrl要求从server提供template,懒得搭建server,所以下面直接用template而不是templateUrl
            //template: '<div><li ng-repeat="item in found">({{item.short_name}}) {{item.name}}<button ng-click="remove($index)">Not this one</button></li><div class="error" ng-if="found.length===0">Nothing Found</div></div>',  
            templateUrl: 'https://bhqasx.github.io/assignment3-starter-code/loader/itemsloaderindicator.template.html',
            scope: {
                remove: '=',
                found: '='
            },
            //controller: NarrowDownCtrl,
            //controllerAs: 'Controller1',
            //bindToController: true            
        };

        return ddo;
    }

    NarrowDownCtrl.$inject = ['MenuSearchService'];
    function NarrowDownCtrl(MenuSearchService) {
        var menu = this;
        var promise = MenuSearchService.getMenu();  //不一定要用promise做变量名

        menu.search =  function() {
            menu.found = [];
            promise.then(function (response) {
                menu.whole = response.data.menu_items;
                for (var i=0; i<menu.whole.length; i++) {
                    var description =menu.whole[i].description;
                    if (description.indexOf(menu.iterm2S) !== -1) {
                        menu.found.push(menu.whole[i]);
                    }
                }
                console.log(menu.found);
            })
            .catch(function(error){
                console.log('can not get menu from server');
            });           
        }

        menu.remove = function(index) {
            menu.found.splice(index,1);
        }
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMenu = function() {
            var response = $http({
                method: 'GET',
                url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
            });

            return response;
        }
    }
})();