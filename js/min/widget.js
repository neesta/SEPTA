define(["jquery","gmaps"],function(t,e){"use strict";function a(){return t("label").html("Auto Refresh <span class='subtle'>- every 30 seconds</span>"),t.getJSON(l,c,n)}function n(e){var a=document.location.hash,n=a.split("#")[1],r=0,l="",o=[];d=e,console.log(d),a!=h&&""!=a&&(t(".select-destination").val(n),t(".destinationTxt").html(n),h=i(n,"ugly")),document.title="SEPTA "+h+" Station Rundown",t.each(d,function(t,e){var a=e.dest;if(a===h){r++;var n="<div class='col-xs-12 col-md-6'>"+s(e,t)+"</div>";o.push(n)}}),r>=1?(t("#ajax").html(o),t.each(d,function(t,e){var a=e.dest;if(a===h){var n=new g.LatLng(parseFloat(e.lat),parseFloat(e.lon)),s={center:n,zoom:16},i=new g.Map(document.getElementById("map-canvas"+t),s),r=new google.maps.Marker({position:n,map:i,title:"I'm here!"});r.setMap(i),g.event.addDomListener(window,"resize",function(){var t=i.getCenter();g.event.trigger(i,"resize"),i.setCenter(t)})}})):(l="<br><br><h5>Well it looks like there aren't any trains currently headed towards "+h+"</h5>",t("#ajax").html(l))}function s(t,e){var a="",n=t.nextstop,s=t.late;return a+="<ul class='train'>",a+="<li class='stop-info'><a target='_blank' href='"+r(n)+"'><h4>Next Stop <stromg>"+i(n,"pretty")+"</h4></a></li>",a+=0===s?"<li class='status bg-success'>The train is not late.</li>":1===s?"<li class='status bg-danger'>It's running "+s+" minute late.</li>":"<li class='status bg-danger'>It's running "+s+" minutes late.</li>",a+="<li><div id='map-canvas"+e+"'></div></li>",a+="</li></ul>"}function i(t,e){var a,n=t.split(" "),s=e,i=n.length;if("ugly"===s)for(var r=0;i>r;r++)"Hill"===n[r]&&(n[r]="H");if("pretty"===s)for(var r=0;i>r;r++)switch(n[r]){case"H":n[r]="Hill";break;case"Jct":n[r]="Junction";break;case"U":n[r]="University";break;case"St":n[r]="Street";break;case"Terminal":n[r]="";break;case"A":n[r]=""}return a=n.join(" "),console.log(a),n.join(" ")}function r(t){var e=t,a=i(e,"pretty").replace(/ /g,"").toLowerCase();return p+a+".html"}const l="http://www3.septa.org/hackathon/TrainView/?callback=?",o=3e4;var c={},u=!1,h="Warminster",d=[],g=e,p="http://www.septa.org/stations/rail/";a(),t("#autoRefresh").change(function(){u=t(this).prop("checked")?!0:!1});setInterval(function(){u&&a()},o);t(".select-destination").change(function(){h=t(this).val(),document.location.hash=h,n(d)})});