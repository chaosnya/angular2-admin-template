import {Component, OnInit} from '@angular/core'
import {ContentHeaderController} from '../../core/index'

@Component({
    selector: 'calendar',
    templateUrl: 'views/calendar/calendar.html',
})

export class CalendarComponent implements OnInit {

    constructor(private contentHeaderController: ContentHeaderController) {
        contentHeaderController.changeHeader({
            title: "Calendar",
            subTitle: "Control panel"
        })
    }


    /* initialize the external events
     -----------------------------------------------------------------*/
    ini_events(ele: JQuery) {
        ele.each(function () {

            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            }

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 1070,
                revert: true, // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            })

        })
    }


    ngOnInit() {

        this.ini_events($('#external-events div.external-event'))

        /* initialize the calendar
         -----------------------------------------------------------------*/
        //Date for the calendar events (dummy data)
        var date = new Date()
        var d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear()
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            buttonText: {
                today: 'today',
                month: 'month',
                week: 'week',
                day: 'day'
            },
            //Random default events
            events: [
                {
                    title: 'All Day Event',
                    start: new Date(y, m, 1),
                    backgroundColor: "#f56954", //red
                    borderColor: "#f56954" //red
                },
                {
                    title: 'Long Event',
                    start: new Date(y, m, d - 5),
                    end: new Date(y, m, d - 2),
                    backgroundColor: "#f39c12", //yellow
                    borderColor: "#f39c12" //yellow
                },
                {
                    title: 'Meeting',
                    start: new Date(y, m, d, 10, 30),
                    allDay: false,
                    backgroundColor: "#0073b7", //Blue
                    borderColor: "#0073b7" //Blue
                },
                {
                    title: 'Lunch',
                    start: new Date(y, m, d, 12, 0),
                    end: new Date(y, m, d, 14, 0),
                    allDay: false,
                    backgroundColor: "#00c0ef", //Info (aqua)
                    borderColor: "#00c0ef" //Info (aqua)
                },
                {
                    title: 'Birthday Party',
                    start: new Date(y, m, d + 1, 19, 0),
                    end: new Date(y, m, d + 1, 22, 30),
                    allDay: false,
                    backgroundColor: "#00a65a", //Success (green)
                    borderColor: "#00a65a" //Success (green)
                },
                {
                    title: 'Click for Google',
                    start: new Date(y, m, 28),
                    end: new Date(y, m, 29),
                    url: 'http://google.com/',
                    backgroundColor: "#3c8dbc", //Primary (light-blue)
                    borderColor: "#3c8dbc" //Primary (light-blue)
                }
            ],
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            drop: function (date, allDay) { // this function is called when something is dropped

                // retrieve the dropped element's stored Event Object
                var originalEventObject = $(this).data('eventObject')

                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject)

                // assign it the date that was reported
                copiedEventObject.start = date
                copiedEventObject.allDay = allDay
                copiedEventObject.backgroundColor = $(this).css("background-color")
                copiedEventObject.borderColor = $(this).css("border-color")

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true)

                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove()
                }

            }
        })


        /* ADDING EVENTS*/
        var currColor = "#3c8dbc" //Red by default
        //Color chooser button
        var colorChooser = $("#color-chooser-btn")
        $("#color-chooser > li > a").click(event => {
            event.preventDefault()
            //Save color
            currColor = $(event.target).css("color")
            //Add color effect to button
            $('#add-new-event').css({"background-color": currColor, "border-color": currColor})
        })
        $("#add-new-event").click(event => {
            event.preventDefault()
            //Get value and make sure it is not null
            var val = $("#new-event").val()
            if (val.length == 0) {
                return
            }

            //Create events
            var eventNode = $("<div />")
            eventNode.css({"background-color": currColor, "border-color": currColor, "color": "#fff"}).addClass("external-event")
            eventNode.html(val)
            $('#external-events').prepend(eventNode)

            //Add draggable funtionality
            this.ini_events(eventNode)

            //Remove event from text input
            $("#new-event").val("")
        })
    }
}
