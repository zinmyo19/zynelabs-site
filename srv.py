import http.server,socketserver,os
class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self,path):
        p=super().translate_path(path); return p
os.chdir('/workspace/swtest/site')
socketserver.TCPServer.allow_reuse_address=True
http.server.ThreadingHTTPServer(('0.0.0.0',8101),H).serve_forever()
