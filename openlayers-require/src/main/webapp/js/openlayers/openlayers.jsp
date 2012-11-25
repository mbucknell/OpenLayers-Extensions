
<%
    String debug = Boolean.parseBoolean(request.getParameter("debug-qualifier")) ? "/lib" : "";
    String deprecated = Boolean.parseBoolean(request.getParameter("include-deprecated")) ? "true" : "false";
%>

<script type="text/javascript">
    if (!requireConfig) {
        requireConfig = {}
    } 
    
    if (!requireConfig.paths) {
        requireConfig.paths = {};
    } 
    
    if (!requireConfig.shim) {
        requireConfig.shim = {};
    }
    
    requireConfig.paths.OpenLayers = '${param['relPath']}openlayers<%= debug %>/OpenLayers';
    
    <% if (deprecated == "true") { %>
        requireConfig.paths['OpenLayers-Deprecated'] = '${param['relPath']}openlayers/lib/deprecated';
    <% }%>
        
    requireConfig.shim.OpenLayers = {
        exports : 'OpenLayers'
    }
    
</script>