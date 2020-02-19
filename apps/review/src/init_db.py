def init_db(BookList, Review):
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
