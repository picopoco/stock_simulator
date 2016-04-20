(function () {
	'use strict';

	angular
		.module('stock_simulator.portfolios.controllers', [])
		.controller('PortfoliosIndexController', ['$scope', '$routeParams', 'Portfolios',
			function ($scope, $routeParams, Portfolios) {
				$scope.userID = $routeParams.userID;
				$scope.portfolios = [];
				$scope.createPortfolio = function () {
					Portfolios.create($scope.portfolioName)
						.then(createPortfolioSuccessFn, createPortfolioErrorFn);
				};
				$scope.deletePortfolio = function (idx) {
					Portfolios.deletePortfolio($scope.portfolios[idx].id).then(function () {
						$scope.portfolios.splice(idx, 1);
					});
				};

				initialize($routeParams.userID);

				function initialize(username) {
					Portfolios.all(username).then(initializeSuccessFn, initializeErrorFn);
				}

				function initializeSuccessFn (response) {
					$scope.portfolios = response.data;
				}

				function initializeErrorFn (response) {
					$scope.errorMessage = response.data['detail'];
				}

				function createPortfolioSuccessFn (response) {
					$scope.portfolios.push(response.data);
					//This is necessary to flush out ng-model.
					$scope.portfolioName = '';
					$('#create-portfolio-input').val('');
					$('#create-portfolio-modal').modal('hide');
					var successfulCreationAlert = '<div class="alert alert-success"> \
					<a class="close" data-dismiss="alert">&times;</a> \
					<strong>Success!</strong> Created portfolio ' + response.data.name + '.</div>';
					$('#portfolio-index-alerts').append(successfulCreationAlert);
				}

				function createPortfolioErrorFn (response) {
					$('#create-portfolio-input').val('');
					$('#create-portfolio-modal').modal('hide');
					var errorCreationAlert = '<div class="alert alert-danger"> \
					<a class="close" data-dismiss="alert">&times;</a> \
					<strong>Error!</strong> Could not create portfolio.</div>';
					$('#portfolio-index-alerts').append(errorCreationAlert);
				}
		}]);
})();