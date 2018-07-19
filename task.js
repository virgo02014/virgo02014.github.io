(function(window){
    // 注册一个应用程序的主模块
    window.angular.module('Task', []);

    // 为主模块注册控制器
    // module只传入一个参数，不是创建，是获取已有的 Task 模块
    window.angular.module('Task')
        .controller('tackCtrl', ['$scope', function($scope){
            $scope.text = '';
            $scope.todoList = undefined;
            $scope.historyList = undefined;

            $scope.initData = function () {
                $scope.storageData();
            };

            $scope.storageData = function (type, item) {
                if (type == 'all' || type == 'select') {
                    if (item) {
                        $scope.historyList.map(function(ele){
                            if (ele.key == item.key) {
                                console.log(ele.text);
                                ele.done = item.done;
                            }
                        });
                    }
                    window.localStorage.setItem('task', JSON.stringify($scope.todoList));
                    window.localStorage.setItem('taskHistory', JSON.stringify($scope.historyList));
                } else if (type == 'task'){
                    window.localStorage.setItem('task', JSON.stringify($scope.todoList));
                } else {
                    $scope.todoList = JSON.parse(window.localStorage.getItem('task')) || [];
                    $scope.historyList = JSON.parse(window.localStorage.getItem('taskHistory')) || [];
                }
                $scope.todoList.sort(function(a, b){
                    return a.done - b.done;
                });
            };

            $scope.add = function () {
                var text = $scope.text.trim();
                if (text) {
                    var date = new Date();
                    var temp = {
                        text: text,
                        time: date,
                        key: +date + Math.floor(Math.random() * 90 + 10),
                        done: false
                    };
                    $scope.todoList.unshift(temp);
                    $scope.historyList.unshift(temp);
                    $scope.storageData('all');
                    $scope.text = '';
                }
            };

            $scope.delete = function (text, index) {
                var confirm = window.confirm('你确定要删除记录：' + text);
                if (confirm) {
                    $scope.todoList.splice(index, 1);
                    $scope.storageData('task');
                }
            };

            $scope.doneCount = function () {
                var temp = $scope.todoList.filter(function(item){
                    return item.done;
                });
                return temp.length;
            };

            $scope.getHistory = function () {
                $scope.historyList = JSON.parse(window.localStorage.getItem('taskHistory')) || [];
                $('.container').addClass('modal-open');
                $('.modal.fade').addClass('show');
                $('.backdrop.show').addClass('modal-backdrop');
            };

            $scope.closeModal = function () {
                $('.container').removeClass('modal-open');
                $('.modal.fade').removeClass('show');
                $('.backdrop.show').removeClass('modal-backdrop');
            };

            $scope.clearRecords = function () {
                var confirm = window.confirm('你确定要清空所有记录？');
                if (confirm) {
                    window.localStorage.clear();
                    $scope.todoList = [];
                    $scope.historyList = [];
                }
            };

        }]);
})(window);
