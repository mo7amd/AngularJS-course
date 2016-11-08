'use strict';

angular.module('confusionApp')

.controller('MenuController', ['$scope', 'menuFactory',
  function($scope, menuFactory) {

    $scope.tab           = 1;
    $scope.filtText      = '';
    $scope.showDetails   = false;
    $scope.showMenu      = false;
    $scope.showPromotion = false;
    $scope.message       = "Loading ...";
    // ******************fetch dishes data from server**************************
    $scope.dishes        = menuFactory.getDishes().query(
      function(response) {
    $scope.dishes   = response;
    $scope.showMenu = true;
  },
  function(response) {
    $scope.message = "Error: " + response.status + " " + response.statusText;
    }
  );
  // ****************fetch promotion data from server***************************
    $scope.promotion   = menuFactory.getPromotion().query(
      function(response){
        $scope.promotion     = response;
        $scope.showPromotion = true;
      },
      function(response){
        $scope.message = "Error: " + response.status + " " + response.statusText;
    }
  );
// ************************ tab selection in menu page *************************
    $scope.select = function(setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function(checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function() {
        $scope.showDetails = !$scope.showDetails;
    };
}])
// **********************contactus page controller *****************************
.controller('ContactController', ['$scope',
  function($scope) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName : "",
        agree    : false,
        email    : ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels                = channels;
    $scope.invalidChannelSelection = false;

}])
// ************************* feedback form controller **************************
.controller('FeedbackController', ['$scope','feedbackFactory',
  function($scope,feedbackFactory) {

    $scope.sendFeedback = function() {

        console.log($scope.feedback);

        if (($scope.feedback.agree) && ($scope.feedback.mychannel === "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        } else {
            feedbackFactory.savefeedback().save($scope.feedback);
            $scope.invalidChannelSelection = false;
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName : "",
                agree    : false,
                email    : ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };
}])
// ****************** dishe details page first controller **********************
.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory',
  function($scope, $stateParams, menuFactory) {
    $scope.dish     = {};
    $scope.showDish = false;
    $scope.message  ="Loading ...";
    $scope.dish     = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)}).$promise.then(
      function(response){
        $scope.dish = response;
        $scope.showDish = true;
        },
      function(response) {
        $scope.message = "Error: "+response.status + " " + response.statusText;
        }
      );
   }])

.controller('DishCommentController', ['$scope','menuFactory',
  function($scope,menuFactory) {

    $scope.mycomment = {
        rating : 5,
        comment: "",
        author : "",
        date   : ""
    };

    $scope.submitComment = function () {
      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);
      $scope.dish.comments.push($scope.mycomment);
      menuFactory.getDishes().update({id: $scope.dish.id},$scope.dish);
      $scope.commentForm.$setPristine();
      $scope.mycomment = {
        rating : 5,
        comment: "",
        author : "",
        date   : ""
      };
    };
}])

//********** implement the IndexController and About Controller here **********
.controller('IndexController',['$scope','menuFactory','corporateFactory',
  function($scope,menuFactory,corporateFactory) {
    $scope.showDish      = false;
    $scope.showPromotion = false;
    $scope.showLeader    = false;
    $scope.message       = "Loading ...";
    $scope.dish          = menuFactory.getDishes().get({id:0})
    .$promise
      .then(
        function(response){
          $scope.dish     = response;
          $scope.showDish = true;
        },
        function(response) {
          $scope.message  = "Error: "+response.status + " " + response.statusText;
        }
      );
    $scope.promotion = menuFactory.getPromotion().get({id:0})
    .$promise
        .then(
          function(response){
            $scope.promotion     = response;
            $scope.showPromotion = true;

          },
          function(response){
            $scope.message = "Error: "+response.status + " " + response.statusText;
          }
        );
    $scope.leader = corporateFactory.getLeaders().get({id:3})
    .$promise
      .then(
        function(response){
          $scope.leader = response;
          $scope.showLeader = true;
        },
        function(response){
          $scope.message = "Error" + response.status + "  "+response.statusText;
        }
      );
}])
// ********************** about us page controller *****************************
.controller('AboutController',['$scope','$stateParams','corporateFactory',
  function($scope,$stateParams,corporateFactory) {
    $scope.showLeaders = false;
    $scope.message = "Laoding ...";
    $scope.leadership = corporateFactory.getLeaders().query(
      function(response){
        $scope.leadership = response;
        $scope.showLeaders = true;
      },
      function(response){
        $scope.message = "Error" + response.status+ "   "+response.statusText;
      }
    );
}])

;
