<@markup id="endlessDocLibView" target="documentListContainer" action="after">
    <script type="text/javascript">//<![CDATA[
        YAHOO.Bubbling.subscribe("postSetupViewRenderers", function(layer, args) {
            var scope = args[1].scope;
            var endlessViewRenderer = new Ixxus.DocumentListEndlessScrollRenderer("endless");
            scope.registerViewRenderer(endlessViewRenderer);
        });
    //]]></script>
</@>