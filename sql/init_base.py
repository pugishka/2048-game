from flask import Flask, request, render_template
import sqlite3
# https://github.com/PyMySQL/PyMySQL
import pymysql.cursors

#connection = sqlite3.connect('joueurs.db')


# Connect to the database
connection = pymysql.connect(host='www-ens.iro.umontreal.ca',
                             user='charonon',
                             password='nonp119C',
                             db='charonon_joueurs',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

app = Flask(__name__,  root_path = "../IFT3225_TP3")


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO Joueurs (username, score, administrateur) VALUES (?,?,?)",
            ("username1", 500, "TRUE")
            )

cur.execute("INSERT INTO Joueurs (username, score, administrateur) VALUES (?,?,?)",
            ('username2', 600,  "FALSE")
            )

connection.commit()
connection.close() 
