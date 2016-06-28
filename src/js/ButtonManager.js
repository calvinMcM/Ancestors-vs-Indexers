/**
 * Created by calvinmcm on 6/28/16.
 */

define(['jquery','GEvent'], function($, GEvent){

    function ButtonManager(EventManager){
        this.eventManager = EventManager;
        this.sidebarButtons = [];
        this.topbarButtons = [];
    }

    /**
     * Any basic setup that needs to happen after instantiation should happen here.
     */
    ButtonManager.init = function(){};

    /**
     * Handles a given event
     * @param event the event to be handled. See [GEvent.js]
     */
    ButtonManager.prototype.handle = function(event){
        var self = this;
        switch(event.type){
            case GEvent.TPBAR_LD:
                switch (event.value){
                    case GEvent.GM_TPBAR:
                        self.loadGameTopBarButtons(event.data);
                        break;
                }
                break;
            case GEvent.SDBAR_LD:
                switch (event.value){
                    case GEvent.BLDG_PNL:
                        self.loadBuildingButtons(event.data);
                        break;
                    case GEvent.INDX_PNL:
                        self.loadIndexerButtons(event.data);
                        break;

                }
                break;
        }
    };

    ButtonManager.prototype.killAll = function(buttons){
        for(var i in buttons){
            if(buttons.hasOwnProperty(i)){
                buttons[i].off('click');
            }
        }
        buttons = [];
    };

    /**
     * Attaches the handlers for the buttons on the game's top bar
     */
    ButtonManager.prototype.loadGameTopBarButtons = function(data){
        var self = this;
        self.killAll(self.topbarButtons);

        if(data && data.length && data[0] == "success") { // If the topbar was able to load up successfully
            var structures_button = $('#structures-button');
            var indexers_button = $('#indexers-button');

            self.topbarButtons = [structures_button, indexers_button];

            structures_button.click(function () {
                self.eventManager.handle(GEvent.LD_SDBAR, GEvent.BLDG_PNL, []);
            });

            indexers_button.click(function () {
                self.eventManager.handle(GEvent.LD_SDBAR, GEvent.INDX_PNL, []);
            });
        }
    };

    /**
     * Loads the handlers for the building buttons in the sidebar
     */
    ButtonManager.prototype.loadBuildingButtons = function(data){
        var self = this;
        self.killAll(self.sidebarButtons);

        if(data && data.length && data[0] == "success") { // If the sidebar was able to load up successfully
            var button_1 = $('#button-1');
            var button_2 = $('#button-1');
            var button_1_image = $('#button-1-img');
            var button_2_image = $('#button-2-img');

            self.sidebarButtons.push(button_1, button_2, button_1_image, button_2_image);

            button_1.click(function () {
                console.log("changed element type to building");
                self.eventManager.handleButtonEvent(new GEvent(GEvent.ST_CLICK, GEvent.STAN_BLD, []));
            });
            button_2.click(function () {
                self.eventManager.handleButtonEvent(new GEvent(GEvent.ST_CLICK, GEvent.LIBR_BLD, []));
            });
            button_1_image.click(function () {
                button_1.click()
            });
            button_2_image.click(function () {
                button_2.click()
            });
        }
    };

    /**
     * Loads the handlers for the indexers buttons in the sidebar.
     */
    ButtonManager.prototype.loadIndexerButtons = function(){
        var self = this;
        self.killAll(self.sidebarButtons);

        if(data && data.length && data[0] == "success") { // If the sidebar was able to load up successfully
            var button_1 = $('#button-1');
            var button_2 = $('#button-1');
            var button_1_image = $('#button-1-img');
            var button_2_image = $('#button-2-img');

            self.sidebarButtons.push(button_1, button_2, button_1_image, button_2_image);

            button_1.click(function () {
                console.log("changed element type to indexer");
                self.eventManager.handleButtonEvent(new GEvent(GEvent.ST_CLICK, GEvent.STAN_IDX, []));
            });
            button_2.click(function () {
                self.eventManager.handleButtonEvent(new GEvent(GEvent.ST_CLICK, GEvent.HOBB_IDX, []));
            });
            button_1_image.click(function () {
                button_1.click()
            });
            button_2_image.click(function () {
                button_2.click()
            });
        }
    };

    return ButtonManager;
});