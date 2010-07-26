(function (W, D) {
  var isIE = /*@cc_on!@*/0, hasCanvas = !!D.createElement('canvas').getContext,
      Rotator = function (elemRef) {
        if (elemRef.nodeName.toLowerCase() !== 'img') {
          throw new Error('The Element referenced is not an image')
        }
        
        var self = this;
        
        self.image = elemRef;
        self.angle = 0;
        
        Bind(D.getElementsByTagName('body')[0], 'unload', function () { self.unload() }, false);
        
        //Bind(elemRef, 'load', function () { self.init() }, false);
        self.init();
        elemRef = null;
      },
      Bind = (function () {
        if (D.addEventListener) {
          return function (elem, evt, fn, bubble) {
            elem.addEventListener(evt, fn, bubble || false);
          }
        } else if (D.attachEvent) {
          return function (elem, evt, fn) {
            elem.attachEvent('on' + evt, fn);
          }
        }
      }());

  if (isIE && !hasCanvas) {
    Rotator.prototype.createVMLNode = (function () {
      D.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
      
      try {
        !D.namespaces.rvml && D.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
        return function (tagName) {
            return D.createElement('<rvml:' + tagName + ' class="rvml">');
        };
      } catch (e) {
        return function (tagName) {
            return D.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
        };
      }
    }());
  }
    
  Rotator.prototype.init = function () {
    var self = this,
        img = self.image,
        src = img.src,
        width = img.width,
        height = img.height;
        
    self.holder = D.createElement('span');
    
    self.holder.style.position = 'relative';
    self.holder.style.display = 'inline-block';
    
    img.parentNode.insertBefore(self.holder, img);
    
    if (isIE && !hasCanvas) {
      self.canvas = self.createVMLNode('image');
      self.canvas.style.height = height + 'px';
      self.canvas.style.width = width + 'px';
      self.holder.style.width = width + 'px';
      self.holder.style.height = height + 'px'
      self.canvas.style.top = '0px';
      self.canvas.style.left = '0px';
      self.canvas.style.position = 'absolute';
      
      self.canvas.src = src;
    } else {
      self.canvas = D.createElement('canvas');
      self.canvas.height = height;
      self.canvas.width = width;
      self.context = self.canvas.getContext('2d');
      
      self.rotate(0);
    }

    img.style.display = 'none';
    self.holder.appendChild(self.canvas);
  };

  Rotator.prototype.rotate = (function () {
    if (isIE && !hasCanvas) {
      return function (angle) {
        var self = this;
        
        self.angle = angle;
        self.canvas.style.rotation = angle;
      }
    } else if (hasCanvas) {
      return function (angle) {
        var self = this,
            width = self.image.width,
            height = self.image.height;
        
        self.angle = angle;
        angle = (angle%360) * Math.PI / 180;
        
        self.context.save();
        self.context.translate(width/2,height/2)
        self.context.rotate(angle);
        self.context.translate(-width/2,-height/2);
        self.context.drawImage(self.image, 0, 0);
        self.context.restore();
      }
    }
  }());

  Rotator.prototype.restore = function () {
    this.rotate(0)
  };

  Rotator.prototype.unload = function () {
    this.image = null;
    this.canvas = null;
    this.holder = null;
  };

  W.Rotator = Rotator;
  W.Bind = Bind;
}(window, document));