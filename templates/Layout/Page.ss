<div class="container">
    <article>
        <% if $Title %><h1>$Title</h1><% end_if %>

        <%--$BlockArea('BeforeContent')--%>

        <div class="content">$Content</div>

        <%--$BlockArea('AfterContent')--%>
    </article>
    $Form
</div>