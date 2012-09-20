/**
 * All rights reserved.
 * Copyright (c) Ixxus Ltd 2012
 */
//Ensure Ixxus root object exists
if (typeof Ixxus == "undefined" || !Ixxus)
{
   var Ixxus = {};
}

/**
 * DocumentList component.
 *
 * @namespace Ixxus
 * @class Ixxus.DocumentList
 */
(function()
{
	/**
	* YUI Library aliases
	*/
	var Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
	    Anim = YAHOO.util.Anim;
	   
	/**
	* Alfresco Slingshot aliases
	*/
	var $html = Alfresco.util.encodeHTML;
	/**
	* DocumentListEndlessScrollRenderer constructor.
	*
	* @param name {String} The name of the EndlessScrollRenderer
	* @return {Ixxus.DocumentListEndlessScrollRenderer} The new EndlessScrollRenderer instance
	* @constructor
	*/
	Ixxus.DocumentListEndlessScrollRenderer = function(name)
	{
		Ixxus.DocumentListEndlessScrollRenderer.superclass.constructor.call(this, name);
		//use the detailed view banner rendering
		this.metadataBannerViewName = "detailed";
		this.metadataLineViewName = "detailed";
		//setup the loading message as we dont want to modify the main DocList FTL so will manipulate the DOM in JS
        this.loadingDiv = document.createElement("DIV"); 
        this.loadingDiv.className = "loadingDiv";
        this.loadingDiv.innerHTML = Alfresco.util.message("endless.loadingMessage", "Alfresco.DocumentList");
		//need to setup the function to be called
		this._handleScroll= function DL__handleScroll(e)
		{
			var scrollPos;
			if(this.updateInitiated||this.options.viewRendererName!="endless"){
				return;
			}   
			//Find the pageHeight and clientHeight(the no. of pixels to scroll to make the scrollbar reach max pos)
			var pageHeight = document.documentElement.scrollHeight;
			var clientHeight = document.documentElement.clientHeight;
			 //Handle scroll position in case of IE differently
			if(YAHOO.env.ua.ie){
				scrollPos = document.documentElement.scrollTop;
			}else{
				scrollPos = window.pageYOffset;
			}
	  
			//Check if scroll bar position is just 50px above the max, if yes, initiate an update
			//Also make sure we are not on the last page
			if((pageHeight - (scrollPos + clientHeight) < 50)&& this.currentPage<this.widgets.paginator.getTotalPages()){
				//set the flag so we know that we are updatingVia the scroll handler
				this.updateInitiated = true;
				//findout what the next page would be
				var nextPage = parseInt(this.currentPage) + 1;
		        Alfresco.logger.debug("scrolled to end firing the paginator setPage to "+nextPage );
				//fire the pagination to the next page and display loading message
		        this.widgets.dataTable.appendChild(this.viewRenderers.endless.loadingDiv);
				this.widgets.paginator.setPage(nextPage);
			}
		};
		return this;
	};
	 /**
	 * Extend from Alfresco.DocumentListViewRenderer
	 */
	YAHOO.extend(Ixxus.DocumentListEndlessScrollRenderer, Alfresco.DocumentListViewRenderer);
	var oldPaginator;
    /**
     * Render the view using the given scope (documentList), request and response.
     * Instead of replacing the YUI dataTable eachtime this will detect if the table needs to be initialised or appended to
     *
     * @method renderView
     * @param scope {object} The DocumentList object
     * @param sRequest {string} Original request
     * @param oResponse {object} Response object
     * @param oPayload {MIXED} (optional) Additional argument(s)
     */
	Ixxus.DocumentListEndlessScrollRenderer.prototype.renderView = function Ixxus_Endless_DL_VR_renderView(scope, sRequest, oResponse, oPayload)
    {
        YAHOO.util.Dom.setStyle(scope.id + this.parentElementIdSuffix, 'display', '');
        //hide the paginators
        Dom.setStyle(scope.id + "-paginator", "display", "none");
        Dom.setStyle(scope.id + "-paginatorBottom", "display", "none");
        //this Method is the only one i could find that is called when the render view is turned on so this is where we will add the event listener for scrolling
        Alfresco.logger.debug("Add scroll listener" );
        Event.addListener(window, "scroll", this._handleScroll, scope, true);
        //check to see if initiated by scroll or by turning on the view
        //TODO - fix issue with having to query twice if not on page 1
        //TODO - fix issue with changing filters
        if(scope.updateInitiated){
        	Alfresco.logger.debug("append dataTable and set updateInitiated to false" );
        	//append rows instead of replacing the table
        	scope.widgets.dataTable.onDataReturnAppendRows.call(scope.widgets.dataTable, sRequest, oResponse, oPayload);
        	//remove the loading message
        	scope.widgets.dataTable.removeChild(scope.viewRenderers.endless.loadingDiv);
        	//reset the flag that indicates we are updating via a scroll
        	scope.updateInitiated=false;
		}
		else {
			Alfresco.logger.debug("InitializeTable " +scope.currentFilter.filterId+" "+scope.currentFilter.filterData );
			//if this is not the first page we need to change to the first page
			//also need to detect if its a change of filter not page
			//if( scope.currentPage && parseInt(scope.currentPage)!=1 && scope.oldFilter && scope.oldFilter==scope.currentFilter.filterData){
			//	scope.widgets.paginator.setPage(1);
			//}
			scope.widgets.dataTable.onDataReturnInitializeTable.call(scope.widgets.dataTable, sRequest, oResponse, oPayload);	
		}
        scope.oldFilter = scope.currentFilter.filterData;
        
    };    
    /**
     * Performs any teardown or visual changes to deselect this view in the interface
     * resets any flags we have constructed and removes the event listener
     *
     * @method destroyView
     * @param scope {object} The DocumentList object
     * @param sRequest {string} Original request
     * @param oResponse {object} Response object
     * @param oPayload {MIXED} (optional) Additional argument(s)
     */  
    Ixxus.DocumentListEndlessScrollRenderer.prototype.destroyView = function DL_VR_destroyView(scope, sRequest, oResponse, oPayload)
    {
    	//this is called for ALL registered view renders when the selected render is changed so we need to detect that we are chaning from this one to another 
    	if(scope.options.viewRendererName!="endless"){
    		Alfresco.logger.debug("set updateInitiated to false and remove scroll handler" );
        	scope.updateInitiated=false;
        	Event.removeListener(window, "scroll", this._handleScroll);
        	//re-display the paginator
        	Dom.setStyle(scope.id + "-paginator", "display", "block");
            Dom.setStyle(scope.id + "-paginatorBottom", "display", "block");
    	}
        Dom.setStyle(scope.id + this.parentElementIdSuffix, 'display', 'none');
     };


})();

