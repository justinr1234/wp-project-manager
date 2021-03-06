/**
 * Required jQuery methods 
 * 
 * @type Object
 */
var PM_Task = {
    init: function() {
        this.datepicker();
        this.sortable();
    },

    sortable: function (el, binding, vnode) {
        var $ = jQuery;
        var component = vnode.context;
        

        $(el).sortable({
            cancel: '.nonsortable,form',
            connectWith: '.pm-connected-sortable',
            placeholder: "ui-state-highlight",
            
            update: function(event, ui) {
                if(ui.sender) {
                    
                } else {
                    PM_Task.sorting(this, vnode);
                };
            }
        });
    },

    sorting: function(self, vnode) {
        var $ = jQuery;
        var component = vnode.context;

        var newOrder = {},
            orders = [],
            ids = [],
            send_data = [];
            
        // finding new order sequence and old orders
        $(self).find('li.pm-todo').each( function(e) {
            var order = $(this).data('order'),
                task_id = $(this).data('id');
            
            orders.push(order);
            ids.push(task_id);
           

            var task_index = component.getIndex(component.list.incomplete_tasks.data, task_id,'id');
            
            if (task_index !== false && typeof component.list.incomplete_tasks !== 'undefined') {
                component.list.incomplete_tasks.data[task_index].order = order;
            }

            if (task_index === false) {
                var task_index = component.getIndex(component.list.complete_tasks.data, task_id,'id');

                if ( task_index !== false && typeof component.list.complete_tasks !== 'undefined') {
                    component.list.complete_tasks.data[task_index].order = order;
                }
            }

        }); 

        var after_revers_order = orders.sort(),
            after_revers_order = after_revers_order.reverse();

        after_revers_order.forEach(function(order, key) {
            send_data.push({
                id: ids[key],
                order: order
            });
        });

        var data = {
            task_orders: send_data,
            board_id: component.list.id,
            board_type: 'task_list'
        }
        component.taskOrder(data);
    },

    datepicker: function(el, binding, vnode) {
        var $ = jQuery;
        $( '.pm-date-field').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            yearRange: '-50:+5',
            onSelect: function(dateText) {
                vnode.context.$root.$emit( 'pm_date_picker', { field: 'datepicker', date: dateText } );
            }
        });

        $( ".pm-date-picker-from" ).datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $( ".pm-date-picker-to" ).datepicker( "option", "minDate", selectedDate );
            },
            onSelect: function(dateText) {
                vnode.context.$root.$emit( 'pm_date_picker', { field: 'datepicker_from', date: dateText, self: this } );
            }
        });

        $( ".pm-date-picker-to" ).datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $( ".pm-date-picker-from" ).datepicker( "option", "maxDate", selectedDate );
            },
            onSelect: function(dateText) {
                vnode.context.$root.$emit( 'pm_date_picker', { field: 'datepicker_to', date: dateText } );
            }
        });

        $( ".pm-date-time-picker-from" ).datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $( ".pm-date-time-picker-to" ).datepicker( "option", "minDate", selectedDate );
            },
            onSelect: function(dateText) {
                
            }
        });

        $( ".pm-date-time-picker-to" ).datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $( ".pm-date-time-picker-from" ).datepicker( "option", "maxDate", selectedDate );
            },
            onSelect: function(dateText) {
               
            }
        });
    },

    disableLineBreak: function(element) {
        jQuery(element).on( 'keypress', function(e) {
            if ( e.keyCode == 13 && !e.shiftKey ) {
                e.preventDefault();
            }
        });
    }
}

//Register a global custom directive called v-pm-datepicker
pm.Vue.directive('pm-datepicker', {
    inserted: function (el, binding, vnode) {
        PM_Task.datepicker( el, binding, vnode );
    },
});

// Register a global custom directive called v-pm-sortable
pm.Vue.directive('pm-sortable', {
    inserted: function (el, binding, vnode) {
        PM_Task.sortable(el, binding, vnode);
    }
});

// Register a global custom directive called v-pm-sortable
pm.Vue.directive('pm-tiptip', {

    update: function () {
        jQuery('.pm-tiptip').tipTip();
    }
});

// Register a global custom directive called v-pm-sortable
pm.Vue.directive('prevent-line-break', {

    inserted: function (element) {
        PM_Task.disableLineBreak(element);
    }
});
