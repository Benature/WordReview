#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from config import config

BASE_DIR = os.path.abspath(__file__)
sys.path.append(os.path.join(BASE_DIR, "pypi"))

if len(sys.argv) == 1:
    sys.argv.append('runserver')


def Is_child_processing():
    from multiprocessing.connection import Listener
    from queue import Queue
    from threading import Thread

    q = Queue()

    def lock_system_port(_port):
        nonlocal q  # it's OK without this announce line
        try:
            listener = Listener(("", _port))
            q.put(False)
        except Exception:  # port be used by parent
            # traceback.print_exc()
            q.put(True)
            return  # child don't listen

        while True:
            serv = listener.accept()  # just bind the port.

    t = Thread(target=lock_system_port, args=(62771, ))
    t.daemon = True
    t.start()
    del t
    return q.get()


def enable_browser_with_delay(argv, _t=None):
    '''open browser'''
    try:
        subcommand = argv[1]  # manage.py runserver
    except IndexError:
        pass

    if subcommand == 'runserver' and '--noreload' not in argv:
        try:
            parser_port = argv[2]
            port_with_colon = parser_port[parser_port.index(
                ":"):] if ':' in parser_port else ":" + parser_port
        except (IndexError, ValueError):
            port_with_colon = ":8000"
        finally:
            import webbrowser
            import time
            if not _t:
                _t = 0.5
            time.sleep(_t)  # you may no need delay, if your machine run faster
            # open project index page
            webbrowser.open_new("http://localhost" + port_with_colon)
            # webbrowser.open_new("http://localhost" + port_with_colon + "/app_name/")  # open app index page


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'WordReview.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?") from exc

    if Is_child_processing() and config.getboolean('custom',
                                                   'auto_open_browser'):
        import threading
        t = threading.Thread(target=enable_browser_with_delay,
                             args=(sys.argv, 1))
        t.start()
        del t

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
