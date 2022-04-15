/*

Brillouin zone WebGL Visualizer

Author: Giovanni Pizzi (2016-2017)

Lincense: The MIT License (MIT)

Copyright (c), 2016-2017, ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE
(Theory and Simulation of Materials (THEOS) and National Centre for 
Computational Design and Discovery of Novel Materials (NCCR MARVEL)),
Switzerland.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var prettifyLabel = function(label, forSVG) {

        forSVG = typeof forSVG !== 'undefined' ? forSVG : false;

        // Gamma
        label = label.replace(/GAMMA/gi,'&Gamma;');
        label = label.replace(/GM/gi,'&Gamma;');
        // Delta
        label = label.replace(/DELTA/gi,'&Delta;');
        label = label.replace(/DT/gi,'&Delta;');
        // Sigma
        label = label.replace(/SIGMA/gi,'&Sigma;');
        // Lambda
        label = label.replace(/LAMBDA/gi,'&Lambda;');
        label = label.replace(/\-/gi, '&mdash;')

        // Underscores
        if (forSVG) {
            label = label.replace(/_(.)/gi,
                function (match, p1, offset, string) {
            return '<tspan baseline-shift="sub">'+p1+'</tspan>';
            });
        }
        else {
            label = label.replace(/_(.)/gi,
                function (match, p1, offset, string) {
                    return '<sub>'+p1+'</sub>';
            });
        }

        return label;
}

var BZVisualizer = function(showAxes, showBVectors, showPathpoints, useSVGRenderer) {
    // Global variables
    showAxes = (typeof showAxes !== 'undefined') ?  showAxes : true;
    showBVectors = (typeof showBVectors !== 'undefined') ?  showBVectors : true;
    // If you want to show the points of the explicit path
    showPathpoints = (typeof showPathpoints !== 'undefined') ?  showPathpoints : false; 

    // if true, use the SVG renderer rather than the WebGL one
    // Note that it supports less functionality, and it requires an additional
    // dependency (not in the main three.js code, but in examples/js/renderer
    // (both the svg renderer and the projector))
    // This is mainly useful if you want to get a vector image of the BZ
    // rather than a raster screenshot
    // I tried to convert everything I use to work also with SVG (in particular,
    // the text is the trickiest). However, it's much slower. 
    // So leave by default to false unless you need to take a screenshot.
    // Known issue: in Firefox, with useSVGRenderer = True, scrolling does not work
    useSVGRenderer = (typeof useSVGRenderer !== 'undefined') ?  useSVGRenderer : false; 

    // strings to update
    var to_update = [];

    // HH: Use Lambert to enable light effect
    var bz_material = new THREE.MeshLambertMaterial(
    {
        // color: 0xd53e4f,
        // color: 0x97f3f3,
        color: 0x6ebaae,
        overdraw: 0.5,
        opacity: 0.6,
        transparent: true,
        side: THREE.DoubleSide
    });

    var edge_material = new THREE.LineBasicMaterial(
    {
        color: 0x333333,
        opacity: 1.,
        transparent: false,
        linewidth: 1, 
    });

    var line_material = new THREE.LineBasicMaterial(
    {
        color: 0x045add,
        opacity: 1.,
        transparent: false,
    });

    var point_material = new THREE.MeshBasicMaterial(
    {
        //color: 0x3288bd,
        color: 0xf6c242,
        opacity: 1.,
        transparent: false,
    });

    var pointpath_material = new THREE.MeshBasicMaterial(
    {
        color: 0x883232,
        opacity: 1.,
        transparent: false,
    });

    // Some parameters for taking screenshots - uncomment only for screenshots,
    // then comment again
    /*
    useSVGRenderer = true;
    showAxes = false;
    showBVectors = false;
    */

    // need to be global in the current implementation
    var scene = null;
    var camera = null;
    var renderer = null;
    var current_canvas_id = null;

    this.loadBZAjax = function(url, canvasID, infoID) {
        document.getElementById(infoID).innerHTML = "Loading..."
        $.getJSON(newpath_to_load, function(jsondata) {
            loadBZ(canvasID, infoID, jsondata);
        }).fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
            document.getElementById(infoID).innerHTML = "Request Failed: " + err;
        });
    };

    this.resizeRenderer = function() {
        if (current_canvas_id) {
            var canvas3d = document.getElementById(current_canvas_id);

            var devicePixelRatio = window.devicePixelRatio || 1;

            // current width (in CSS pixels)
            canvas3d_width = canvas3d.offsetWidth;
            canvas3d_height = canvas3d.offsetHeight;

            if (renderer) {
                camera.aspect = canvas3d_width / canvas3d_height;
                camera.updateProjectionMatrix();

                // propertly scale dom element *and* renderer to take into account 
                // devicePixelRatio (that is e.g. 2 on Retina displays)
                renderer.setSize( canvas3d_width * devicePixelRatio, canvas3d_height * devicePixelRatio);
                renderer.domElement.style.width = canvas3d_width + "px";
                renderer.domElement.style.height = canvas3d_height + "px";
                renderer.domElement.width = canvas3d_width * devicePixelRatio;
                renderer.domElement.height = canvas3d_height * devicePixelRatio;
            }
            render();        
        }
    }

    var getText = function(label, color) {

        color = typeof color !== 'undefined' ? color : '#000000';

        if (useSVGRenderer) {
            var textdiv = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            textdiv.setAttribute("y", -100);
            textdiv.setAttribute("x", -100);
            textdiv.setAttribute("font-family", "'Helvetica Neue', Helvetica, Arial, sans-serif");
            var devicePixelRatio = window.devicePixelRatio || 1;
            // 12px, but needs to be rescaled with the device pixel ratio
            textdiv.setAttribute("font-size", (devicePixelRatio * 14) + "px");
            textdiv.setAttribute('fill', color);
            textdiv.innerHTML = label;
        }
        else
        {    
            // Return a text div with the given label, and not unselectable
            var textdiv = document.createElement('div');
            textdiv.style.position = 'absolute';
            textdiv.style.fontFamily = "Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif";
            //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
            textdiv.style.color = color;
            textdiv.style.width = 100;
            textdiv.style.height = 100;
            textdiv.style.fontSize = "16px";
            //text2.style.backgroundColor = "blue";
            textdiv.innerHTML = label;
            // out of view at the beginning
            textdiv.style.top = -100 + 'px';
            textdiv.style.left = -100 + 'px';
            textdiv.style.userSelect = "none";
            textdiv.style.userSelect = "none";
            textdiv.style.webkitUserSelect = "none";
            textdiv.style.MozUserSelect = "none";
            textdiv.setAttribute("unselectable", "on");
            textdiv.style.pointerEvents = "none"; 
        }
        return textdiv;
    }

    var getDoubleClickText = function(the_class) {
        
            // Return a text div with the given label, and not unselectable
            var textdiv = document.createElement('div');
            textdiv.classList.add(the_class);
            textdiv.style.position = 'absolute';
            textdiv.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
            textdiv.style.zIndex = 1;    
            textdiv.style.width = "100%";
            textdiv.style.height = "100%";
            textdiv.style.display = "table";
            textdiv.style.top = '0px';
            textdiv.style.left = '0px';
            textdiv.style.textAlign = "center";
            textdiv.style.verticalAlign = "middle";

            textdiv.style.userSelect = "none";
            textdiv.style.userSelect = "none";
            textdiv.style.webkitUserSelect = "none";
            textdiv.style.MozUserSelect = "none";
            textdiv.setAttribute("unselectable", "on");
            //textdiv.style.pointerEvents = "none"; 

            var textspan = document.createElement('span');
            // start visible, anyway
            textspan.innerHTML = "Double click to toggle interaction";
            textspan.style.color = "rgb(80, 80, 80)";
            textspan.style.fontSize = "24px";
            textspan.style.fontWeight = "bold";
            textspan.style.backgroundColor = "rgba(230,230,230,0.5)";        
            textspan.style.display = "table-cell";
            textspan.style.verticalAlign = "middle";
            textspan.style.lineHeight = "normal";
            textspan.style.userSelect = "none";
            textspan.style.userSelect = "none";
            textspan.style.webkitUserSelect = "none";
            textspan.style.MozUserSelect = "none";
            textspan.setAttribute("unselectable", "on");
            //textspan.style.pointerEvents = "none"; 

            textspan.onmouseover = function() 
            {
                this.style.backgroundColor = "rgba(230,230,230,0.5)";
                this.innerHTML = "Double click to toggle interaction";
            }
            textspan.onmouseleave = function() 
            {
                // 0.0 for alpha doesn't work properly, apparently
                this.style.backgroundColor = "rgba(255,255,255,0.01)";
                this.innerHTML = "";
            }

            textdiv.appendChild(textspan);

            return textdiv;
        }

    this.loadBZ = function(canvasID, infoID, jsondata) {
        // to be used by resizeRenderer
        current_canvas_id = canvasID;
        var canvas3d = document.getElementById(canvasID);

        var devicePixelRatio = window.devicePixelRatio || 1;

        document.getElementById(infoID).innerHTML = ""

        // Remove the renderer (and anything else)
        while (canvas3d.firstChild) {
        canvas3d.removeChild(canvas3d.firstChild);
        }
        // I don't need to clear the text divs, I did it in the line above
        // I just need to empty the to_update list
        to_update = [];

        scene = new THREE.Scene();
        scene.add( new THREE.AmbientLight( 0x808080 ) );

        canvas3d_width = canvas3d.offsetWidth;
        canvas3d_height = canvas3d.offsetHeight;
        // HH: Use OrthographicCamera
        // camera = new THREE.PerspectiveCamera( 45, canvas3d_width / canvas3d_height, 0.01, 1000 );
        camera = new THREE.OrthographicCamera( -1.5, 1.5, 1.5, -1.5, 0.01, 1000 );
        // If I don't move it, I cannot pan
        camera.position.z = 3;
        let light1 = new THREE.PointLight( 0xffffff, 1, 20 );
        light1.position.set( 0, 4, 0 );
        camera.add( light1 );
        let light2 = new THREE.PointLight( 0xffffff, 1, 20 );
        light2.position.set( 5, -8, -3 );
        //camera.add( light2 );
        scene.add( camera );

        //var raycaster = new THREE.Raycaster();

        if (useSVGRenderer) {
            renderer = new THREE.SVGRenderer();
            renderer.setQuality('high');
        }
        else {
            renderer = new THREE.WebGLRenderer({ 
                alpha: true,
            preserveDrawingBuffer: true, // to allow taking screenshots
                //antialias: true // could be much slower!
            });        
        }
        // white bg (not needed if I put alpha = true in WebGL)
        renderer.setClearColor( 0xffffff, 0);

        // propertly scale dom element *and* renderer to take into account 
        // devicePixelRatio (that is e.g. 2 on Retina displays)
        renderer.setSize( canvas3d_width * devicePixelRatio, canvas3d_height * devicePixelRatio);
        renderer.domElement.style.width = canvas3d_width + "px";
        renderer.domElement.style.height = canvas3d_height + "px";
        renderer.domElement.width = canvas3d_width * devicePixelRatio;
        renderer.domElement.height = canvas3d_height * devicePixelRatio;

        //document.body.appendChild( renderer.domElement );
        canvas3d.appendChild( renderer.domElement );

        // Now is commented, needs to be called by hand
        // var doc = canvas3d.ownerDocument;
        // var win = doc.defaultView || doc.parentWindow;
        // win.addEventListener("resize", resizeRenderer);

        //let controls0 = new THREE.OrbitControls( camera, renderer.domElement );
        //controls0.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        //// needed because we want to redraw only on change
        //controls0.enableDamping = true;
        //controls0.dampingFactor = 0.25;
        //controls0.enableZoom = true;

        controls = new THREE.OrthographicTrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [ 65, 83, 68 ];
        controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)

        special_points = jsondata['kpoints'];
        // HH: slice() is required to keep b vectors intact when calling showLines
        // need to investigate why FIXME
        b1 = jsondata['b1'].slice();
        b2 = jsondata['b2'].slice();
        b3 = jsondata['b3'].slice();

        max_b_length = Math.sqrt(Math.max(
            Math.pow(b1[0],2) + Math.pow(b1[1],2) + Math.pow(b1[2],2),
            Math.pow(b2[0],2) + Math.pow(b2[1],2) + Math.pow(b2[2],2),
            Math.pow(b3[0],2) + Math.pow(b3[1],2) + Math.pow(b3[2],2)));
        // HH: for OrthographicCamera
        // camera.position.z = max_b_length * 3;
        var halfwidth = max_b_length * 1.8 / 2;
        var axeslength = halfwidth;
        camera.left = - halfwidth;
        camera.right = halfwidth;
        camera.top = halfwidth;
        camera.bottom = -halfwidth;
        camera.updateProjectionMatrix();

        data = jsondata['faces_data'];
        for (var label in special_points) {
            pos = special_points[label];

            radius = 0.025 * max_b_length;

            var sphere_geometry = new THREE.SphereGeometry(
                radius, 16, 16 );
            var sphere = new THREE.Mesh(
                sphere_geometry, point_material );
            sphere.translateX(pos[0]);
            sphere.translateY(pos[1]);
            sphere.translateZ(pos[2]);
            scene.add(sphere);

            // Label
            // prettify label
            label = prettifyLabel(label,forSVG=useSVGRenderer);        
            var textdiv = getText(label);
            if (useSVGRenderer) {
                renderer.domElement.appendChild(textdiv);
                to_update.push([
                    new THREE.Vector3(pos[0], pos[1], pos[2]), 
                    label]);
                
            }
            else {
                canvas3d.appendChild(textdiv);        
                to_update.push([
                    new THREE.Vector3(pos[0], pos[1], pos[2]), 
                    textdiv]);            
            }
        }

        if (showAxes) {
            // AXES
            //var dir = new THREE.Vector3( 1, 0, 0 );
            axesLabels = [[new THREE.Vector3( 1, 0, 0 ), '<span style="font-weight: bold; font-style: italic">x</span>'],
                [new THREE.Vector3( 0, 1, 0 ), '<span style="font-weight: bold; font-style: italic">y</span>'],
                [new THREE.Vector3( 0, 0, 1 ), '<span style="font-weight: bold; font-style: italic">z</span>']];

            if (useSVGRenderer) {
                axesLabels = [[new THREE.Vector3( 1, 0, 0 ), '<tspan style="font-weight: bold; font-style: italic">x</tspan>'],
                    [new THREE.Vector3( 0, 1, 0 ), '<tspan style="font-weight: bold; font-style: italic">y</tspan>'],
                    [new THREE.Vector3( 0, 0, 1 ), '<tspan style="font-weight: bold; font-style: italic">z</tspan>']];
            }

            axesLabels.forEach(
                function (data) {
                    dir = data[0];
                    label = data[1];

                    // Arrow
                    var origin = new THREE.Vector3( 0, 0, 0 );
                    var hex = 0x3653c5;
                    //var hex = 0xf5873c;
                    var arrow = new THREE.ArrowHelper(
                        dir, 
                        origin,
                        axeslength,
                        hex,
                        headLength=axeslength/10.,
                        headwidth=axeslength/20.);
                    //arrowX.line.material.linewidth = 2;
                    scene.add( arrow );                

                    // Label
                    the_color = '#3653c5';
                    //the_color = '#f5873c';
                    textdiv = getText(label, color=the_color);
                    pos = dir.clone();
                    pos.sub(origin);
                    if (pos.y) {
                      pos.setZ(pos.z - 0.05)
                    }
                    pos.multiplyScalar(axeslength);
                    
                    if (useSVGRenderer) {
                        renderer.domElement.appendChild(textdiv);
                        to_update.push([
                            pos, label, the_color]);
                        
                    }
                    else {
                        canvas3d.appendChild(textdiv);        
                        to_update.push([
                            pos, textdiv]);            
                    }
                });
        }

        // B vectors
        //var dir = new THREE.Vector3( 1, 0, 0 );
        var b_vectors = [[b1, '<span style="font-weight: bold; font-style: italic;">b</span><sub>1</sub>'],
            [b2, '<span style="font-weight: bold; font-style: italic;">b</span><sub>2</sub>'],
            [b3, '<span style="font-weight: bold; font-style: italic;">b</span><sub>3</sub>']
        ];

        if (useSVGRenderer) {
            var b_vectors = [[b1, '<tspan style="font-weight: bold; font-style: italic;">b</tspan><tspan baseline-shift="sub">1</tspan>'],
                [b2, '<tspan style="font-weight: bold; font-style: italic;">b</tspan><tspan baseline-shift="sub">2</tspan>'],
                [b3, '<tspan style="font-weight: bold; font-style: italic;">b</tspan><tspan baseline-shift="sub">3</tspan>']
        ];
        }

        if (!showBVectors) {
            b_vectors = [];
        }

        b_vectors.forEach(
            function (data, i) {
                b = data[0];
                label = data[1];

                b_length = Math.sqrt(Math.pow(b[0],2) + Math.pow(b[1],2) + Math.pow(b[2],2));

                dir = new THREE.Vector3(
                    b[0] / b_length,
                    b[1] / b_length,
                    b[2] / b_length);

                var length = axeslength * 0.95
                // Arrow
                var origin = new THREE.Vector3( 0, 0, 0 );
                var hex = 0x333333;
                var arrow = new THREE.ArrowHelper(
                    dir, 
                    origin,
                    length=length,
                    hex=hex,
                    headLength=length/10.,
                    headwidth=length/20.);
                //arrowX.line.material.linewidth = 2;
                scene.add( arrow );                

                // Label
                var textdiv = getText(label=label);
                // HH: offset label that align with y axis
                if (Math.abs(b[0]) < 1E-2 && Math.abs(b[2]) < 1E-2) {
                  b[2] -= 0.05 * b_length
                }
                pos = new THREE.Vector3(
                    b[0] / b_length * length,
                    b[1] / b_length * length,
                    b[2] / b_length * length);

                if (useSVGRenderer) {
                    renderer.domElement.appendChild(textdiv);
                    to_update.push([
                        pos, label]);
                    
                }
                else {
                    canvas3d.appendChild(textdiv);        
                    to_update.push([
                        pos, textdiv]);            
                }
            });

        // Load BZ
        var brillouinzone = new THREE.Geometry();
        data['triangles_vertices'].forEach(function(vertex) {
            brillouinzone.vertices.push(
                new THREE.Vector3(vertex[0], vertex[1], vertex[2]));
        }); 
        data['triangles'].forEach(function(triangle) {
            brillouinzone.faces.push(
                new THREE.Face3(triangle[0], triangle[1], triangle[2]));
        });
        brillouinzone.computeFaceNormals();
        var bz_mesh = new THREE.Mesh(brillouinzone, bz_material);
        // Create BZ edges
        geometry = new THREE.EdgesGeometry( bz_mesh.geometry );
        var edges = new THREE.LineSegments( geometry, edge_material );
        // Plot BZ and edges
        scene.add(bz_mesh);
        scene.add(edges);


        // draw path
        var meshline_material = new MeshLineMaterial({
          color: new THREE.Color( 0xff4000 ),
          lineWidth: 0.01 
        });
        path = jsondata['path'];
        path.forEach(function (linespec) {
            label1 = linespec[0];
            label2 = linespec[1];
            p1 = special_points[label1];
            p2 = special_points[label2];

            var geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(p1[0], p1[1], p1[2]));
            geometry.vertices.push(
                new THREE.Vector3(p2[0], p2[1], p2[2]));
            // HH: use MeshLine to make thicker lines
            var meshline = new MeshLine();
            meshline.setGeometry( geometry );
            var line = new THREE.Mesh( meshline.geometry, meshline_material );
            // var line = new THREE.Line(geometry, line_material);
            // line.material.linewidth = 4;
            scene.add(line);
        });        


        if (showPathpoints) {
            kpoints_abs = jsondata['explicit_kpoints_abs'];
            for (var idx in kpoints_abs) {
                pos = kpoints_abs[idx];
                radius = 0.005 * max_b_length;

                var sphere_geometry = new THREE.SphereGeometry(
                    radius, 16, 16 );
                var sphere = new THREE.Mesh(
                    sphere_geometry, pointpath_material );
                sphere.translateX(pos[0]);
                sphere.translateY(pos[1]);
                sphere.translateZ(pos[2]);
                scene.add(sphere);
            }
        }


        render();

        var bz_switch_enable = function(event, force_status){ 
            if (typeof force_status == "undefined") {
                var the_status = !controls.enabled;
            }
            else {
                var the_status = force_status;
            }
            
            controls.enabled = the_status;

            elems = canvas3d.getElementsByClassName("BZDoubleClickText");
            for (var i=0; i < elems.length; i++) {
                canvas3d.removeChild(elems[i]);    
            }
            if (the_status) {
                //scene.background = new THREE.Color( 0xffffff );
                //render();
            }
            else {
                //scene.background = new THREE.Color( 0xeeeeee );
                //render();
                canvas3d.appendChild(getDoubleClickText("BZDoubleClickText"));            
            }
        }

        // Default status: disabled
        // HH: remove the shield
        // bz_switch_enable(force_status=false);

        // canvas3d.addEventListener('dblclick', bz_switch_enable);

        var dbltapTimeout;
        var shortTap = false;

        // Manual detect of double tap
        // canvas3d.addEventListener('touchend', function(event) {
        //     if (typeof dbltapTimeout !== 'undefined') {
        //         // start disabling any timeout that would reset shortTap to false
        //         clearTimeout(dbltapTimeout);
        //     }
        //     if (shortTap) {
        //         // if here, there's been another tap a few ms before
        //         // reset the variable and do the custom action
        //         shortTap = false;
        //         event.preventDefault();
        //         bz_switch_enable();
        //     }
        //     else {
        //         if (event.targetTouches.length != 0) {
        //             // activate this only when there is only a finger
        //             // if more than one finger is detected, cancel detection 
        //             // of double tap
        //             if (typeof dbltapTimeout !== 'undefined') {
        //                 // disable the timeout
        //                 clearTimeout(dbltapTimeout);
        //                 shortTap = false;
        //             }                    
        //             return;
        //         }
        //         // If we are here, no tap was recently detected
        //         // mark that a tap just happened, and start a timeout
        //         // to reset this
        //         shortTap = true;
        //         dbltapTimeout = setTimeout(function() {
        //             // after 500ms, reset shortTap to false
        //             shortTap = false;
        //         }, 500);
        //     }
        // });
        // canvas3d.addEventListener('touchcancel', function(event) {
        //     if (typeof dbltapTimeout !== 'undefined') {
        //         // disable the timeout if the touch was canceled
        //         clearTimeout(dbltapTimeout);
        //         shortTap = false;
        //     }                    
        // });
        // canvas3d.addEventListener('touchmove', function(event) {
        //     if (typeof dbltapTimeout !== 'undefined') {
        //         // disable the timeout if the finger is being moved
        //         clearTimeout(dbltapTimeout);
        //         shortTap = false;
        //     }        
        // });

        // This is useful to print out the SVG for reuse
        /*if (useSVGRenderer) {
            console.log('svg content:');
            console.log(renderer.domElement.outerHTML.replace('/<path/g','\n<path'));
        }*/
        // HH
        lines = []
        function showLines(path) {
            lines.forEach(function (line) {
              scene.remove(line)
            })
            var meshline_material = new MeshLineMaterial({
              color: new THREE.Color( 0xff4000 ),
              lineWidth: 0.01 
            });
            a1 = jsondata['a1'];
            a2 = jsondata['a2'];
            a3 = jsondata['a3'];
            A = [a1, a2, a3];
            b1 = jsondata['b1'];
            b2 = jsondata['b2'];
            b3 = jsondata['b3'];
            B = [b1, b2, b3];
            console.log(A);
            console.log(B);

            path.forEach(function (linespec) {
                label1 = linespec[0];
                label2 = linespec[1];
                p1 = special_points[label1];
                p2 = special_points[label2];

                v1 = [0, 0, 0];
                v2 = [0, 0, 0];
                for (i = 0; i < 3; i++) {
                  for (j = 0; j < 3; j++) {
                    v1[i] += p1[j] * A[i][j];
                    v2[i] += p2[j] * A[i][j];
                  }
                }
                dv = [v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2]]
                console.log(label1, label2, dv)
                console.log(label2, v2, p2);
                eps = 0.01
                dv = dv.map(function (d) {
                  if (Math.abs(d - Math.PI * 2) < eps) {
                    return d - Math.PI * 2
                  } else if (Math.abs(d + Math.PI * 2) < eps) {
                    return d + Math.PI * 2
                  }
                  return d
                })
                console.log(label1, label2, dv);
                for (i = 0; i < 3; i++) {
                  v2[i] = v1[i] + dv[i]
                }
                p2 = [0, 0, 0]
                for (i = 0; i < 3; i++) {
                  for (j = 0; j < 3; j++) {
                    p2[j] += v2[i] * B[i][j] / Math.PI / 2
                  }
                }
                console.log(label2, v2, p2);

                var geometry = new THREE.Geometry();
                geometry.vertices.push(
                    new THREE.Vector3(p1[0], p1[1], p1[2]));
                geometry.vertices.push(
                    new THREE.Vector3(p2[0], p2[1], p2[2]));
                // HH: use MeshLine to make thicker lines
                var meshline = new MeshLine();
                meshline.setGeometry( geometry );
                var line = new THREE.Mesh( meshline.geometry, meshline_material );
                // var line = new THREE.Line(geometry, line_material);
                // line.material.linewidth = 4;
                scene.add(line);
                lines.push(line);
            });        
            render();
        }

        return showLines

    }

    function toScreenPosition(vector3D, camera)
    {
        var vector2D = vector3D.clone().project(camera);


        var devicePixelRatio = window.devicePixelRatio || 1;
        if (useSVGRenderer) {
            var widthHalf = 0.5 * renderer.domElement.viewBox.baseVal.width;
            var heightHalf = 0.5 * renderer.domElement.viewBox.baseVal.height;
            var widthOffset = renderer.domElement.viewBox.baseVal.x;
            var heightOffset = renderer.domElement.viewBox.baseVal.y;
            vector2D.x = ( vector2D.x * widthHalf ); 
            vector2D.y = - ( vector2D.y * heightHalf );
            
        }
        else {
            var widthHalf = 0.5*renderer.context.canvas.width / devicePixelRatio;
            var heightHalf = 0.5*renderer.context.canvas.height / devicePixelRatio;
            vector2D.x = ( vector2D.x * widthHalf ) + widthHalf;
            vector2D.y = - ( vector2D.y * heightHalf ) + heightHalf;
        }

        return { 
            left: vector2D.x,
            top: vector2D.y
        };

    };

    // render function
    function render() { 
        //requestAnimationFrame( render );  // activate only if you want to loop and make an animation
        renderer.render( scene, camera ); 
        
        // IMPORTANT! In the case of the SVG renderer, I pass the string, rather
        // than the <div>, and I recreate a new <text> in here. I think this is needed
        // because <text> elements seem to be cleaned up (at least partially) in 
        // the render function?

        if (useSVGRenderer) {
            to_update.forEach(function(data) {
                // For SVG we don't use divs for text, but rather 
                // <text> elements inside the SVG
                pos = data[0];
                textcontent = data[1];
                if (data.length > 2) {
                    the_color = data[2];
                    t = getText(textcontent, the_color);
                }
                else {
                    t = getText(textcontent);
                }
                pos2d = toScreenPosition(pos,camera);
                t.setAttribute("y", pos2d.top);
                t.setAttribute("x", pos2d.left);
                renderer.domElement.appendChild(t);
            });
        }
        else {
            to_update.forEach(function(data) {
                pos = data[0];
                text = data[1];
                pos2d = toScreenPosition(pos,camera);
                text.style.top = pos2d.top + 'px';
                text.style.left = pos2d.left + 'px';
            });
        }
    }

}
