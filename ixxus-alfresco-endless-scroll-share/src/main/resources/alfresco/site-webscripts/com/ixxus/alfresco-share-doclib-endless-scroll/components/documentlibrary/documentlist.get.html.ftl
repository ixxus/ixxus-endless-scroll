<@markup id="endlessDocLibView" target="documentListContainer" action="after">
    <script type="text/javascript">
        document.getElementsByClassName("paginator")[0].setAttribute("style", "visibility:visible")
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