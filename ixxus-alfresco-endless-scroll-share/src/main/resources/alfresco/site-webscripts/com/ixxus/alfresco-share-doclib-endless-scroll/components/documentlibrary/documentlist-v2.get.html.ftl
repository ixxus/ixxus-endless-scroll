<@markup id="endlessDocLibCss" target="css" action="after">
   <link rel="stylesheet" type="text/css" href="${page.url.context}/res/alfresco-share-doclib-endless-scroll/components/documentlibrary/documentlist-endless-scroll.css" />
</@>
<@markup id="endlessDocLibJs" target="js" action="after">
	<script type="text/javascript" src="${page.url.context}/res/alfresco-share-doclib-endless-scroll/components/documentlibrary/documentlist-endless-scroll.js"></script>
</@>

<@markup id="endlessDocLibView" target="documentListContainer" action="after">
    <script type="text/javascript">
        if (document.getElementsByClassName("paginator") && document.getElementsByClassName("paginator")[0])
            document.getElementsByClassName("paginator")[0].setAttribute("style", "visibility:visible")
        if (document.getElementsByClassName("paginatorBottom") && document.getElementsByClassName("paginatorBottom")[0])
            document.getElementsByClassName("paginatorBottom")[0].setAttribute("style", "visibility:visible")
    </script>
    <script type="text/javascript">//<![CDATA[
        YAHOO.Bubbling.subscribe("postSetupViewRenderers", function(layer, args) {
            var scope = args[1].scope;
            var endlessViewRenderer = new Ixxus.DocumentListEndlessScrollRenderer("endless");
            scope.registerViewRenderer(endlessViewRenderer);
            if (scope.options.viewRendererName == "endless") {
                Dom.setAttribute(scope.id + "-paginator", "style", "visibility:hidden");
                Dom.setAttribute(scope.id + "-paginatorBottom", "style", "visibility:hidden");
            } 
        });
    //]]></script>
</@>