# -*- coding: utf-8 -*-
# Copyright (C) 2013 Luís A. Bastião Silva and Universidade de Aveiro
#
# Authors: Luís A. Bastião Silva <bastiao@ua.pt>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#


"""A module for Python index

.. moduleauthor:: Luís A. Bastião Silva <bastiao@ua.pt>

"""

from __future__ import print_function
import pysolr

from questionnaire.models import RunInfoHistory
#from questionnaire.models import Answer, Question

from django.db.models.signals import post_save
from django.dispatch import receiver

from questionnaire.models import *
from searchengine.models import Slugs

from django.db.models.signals import post_save
from django.dispatch import receiver

import logging
import ast

logger = logging.getLogger()

class CoreEngine:
	"""It is responsible for index the documents and search over them
	It also connects to SOLR
	"""

	CONNECTION_TIMEOUT_DEFAULT = 10
	def __init__(self, timeout=CONNECTION_TIMEOUT_DEFAULT):
		# Setup a Solr instance. The timeout is optional.
		self.solr = pysolr.Solr('http://localhost:8983/solr', timeout=timeout)

	def index_fingerprint(self, doc):
		"""Index fingerprint 
		"""
		# index document
		self.index_fingerprint_as_json(doc)
	
	def index_fingerprint_as_json(self, d):
		"""Index fingerprint as json
		"""
		# index document
		
		xml_answer = self.solr.add([d])
		print(xml_answer)
		self.optimize()

	def optimize(self):
		"""This function optimize the index. It improvement the search and retrieve documents subprocess.
		However, it is a hard tasks, and call it for every index document might not be a good idea.
		"""
		self.solr.optimize()

	def update(self, doc):
		"""Update the document
		"""
		# Search  and identify the document id

		# Delete 
		self.solr.delete(id='doc_1')

		# Index the new document
		self.index(doc)

	def search_fingerprint(self, query):
		"""search the fingerprint
		"""
		# Later, searching is easy. In the simple case, just a plain Lucene-style
		# query is fine.
		results = self.solr.search(query)

		return results

	def more_like_this(self, id_doc):
		similar = self.solr.more_like_this(q='id:doc_2', mltfl='text')
		return similar


def convert_text_to_slug(text):
	#TODO: optimize
	return text.replace(' ', '_').replace('?','').replace('.', '').replace(',','')

def clean_answer(answer):
	#TODO: optimize
	return answer


def get_slug_from_choice(v, q):
    choice = Choice.objects.filter(question=q).filter(value=v)
    if (len(choice)>0):
        print(choice[0].text)
        print(choice[0].value)


def convert_answers_to_solr(runinfo):
    c = CoreEngine()
    
    runid = runinfo.runid
    answers = Answer.objects.filter(runid=runid)

    print(answers)
    d = {}
    text = ""
    for a in answers:
    	print("Answer text: " + a.answer)
    	print("Q: " + a.question.text)
    	print("Slug:" + a.question.slug)

    	slug = a.question.slug	
    	
    	slug_aux = ""
    	if len(slug)>2:
    		slug = a.question.slug
    	else:
    		slug = convert_text_to_slug(a.question.text)
    	slug_final = slug+"_t"

    	results = Slugs.objects.filter(description=a.question.text)
    	
    	if results==None or len(results)==0:
    		slugs = Slugs()
    		slugs.slug1 = slug_final
    		slugs.description = a.question.text
    		slugs.question = a.question
    		slugs.save()

    	text_aux = ""
        print(a.question.get_type() )
    	# Verify the question type

    	if a.question.get_type() == "open" or \
        a.question.get_type() == "open-button" \
        or a.question.get_type() == "open-textfield" :
            x = ast.literal_eval(a.answer)
            text_aux = x[0]

    	elif a.question.get_type() == "choice-yesnocomment" or \
        a.question.get_type() == "choice-yesnodontknow" or \
        a.question.get_type() == "choice" or \
        a.question.get_type() == "choice-freeform" or \
        a.question.get_type() == "choice-multiple" or \
        a.question.get_type() == "choice-multiple-freeform" or \
        a.question.get_type() == "comment":

    	    #text_aux = a.answer
            if (len(text_aux)>0):
                x = ast.literal_eval(text_aux)
       
                continue
            print(x)
            for v in x:
                print(get_slug_from_choice(v, a.question))
                text_aux += v + " "
    		
    	
    	else:    		text_aux = a.answer


    	d[slug_final] = text_aux
    print(d)
    d['id']=runid
    d['type_t']=runinfo.questionnaire.name.replace(" ", "").lower()
    d['created_t']=str(runinfo.created)
    c.index_fingerprint_as_json(d)


@receiver(post_save, sender=RunInfoHistory)
def index_handler(sender, **kwargs):
	# Check if it is advanced search or not.
	# If it is advanced search, it is not necessary to index
	# Otherwise the index will be necessary

    print("#### Indexing now ###############")
    logger.debug(sender)
    for key in kwargs:
        logger.debug("another keyword arg: %s: %s" % (key, kwargs[key]))
    runinfo = kwargs["instance"]
    try:
        convert_answers_to_solr(runinfo)
    except:
        print("Error, go here")
        raise
