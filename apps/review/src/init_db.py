def init_db_booklist(BookList, Review):
    for BOOK in ['GRE3000', 'qugen10000']:
        for l in range(len(set(Review.objects.filter(BOOK=BOOK).values_list('LIST')))):
            ld = Review.objects.filter(BOOK=BOOK, LIST=l)  # list data
            print(l)
            rate = sum([r[0] if r[0] is not None else 1 for r in ld.values_list('rate')
                        ]) / len(ld) * 1
            rate = 1 - rate if rate != 0.0 else 0
            data = {
                'LIST': l,
                'BOOK': BOOK,
                'list_rate': rate,
                'word_num': len(ld),
                'review_word_counts': ';'.join(
                    set([str(t[0]) for t in ld.values_list('total_num')])),
            }
            BookList.objects.create(**data)


def init_db_word(Review, Words):
    all = Review.objects.all()
    for review in all:
        old = False
        try:
            word = Words.objects.get(word=review.word)
            old = True
        except:
            data = {
                'word': review.word,
                'mean': review.mean,
                'forget_num': review.forget_num,
                'total_num': review.total_num,
                'history': review.history,
                'rate': review.rate
            }
            word = Words.objects.create(**data)

        if old:
            word.total_num += review.total_num
            word.forget_num += review.forget_num
            word.history += review.history
            if word.total_num != 0:
                word.rate = word.forget_num / word.total_num
        print(word.word)
        word.save()
        # break
