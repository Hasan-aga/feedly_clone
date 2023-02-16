create sequence "public"."articles_articleid_seq";

create sequence "public"."feed_articles_pk_seq";

create sequence "public"."rssfeed_rowid_seq";

create sequence "public"."user_bookmarks_bookmarkid_seq";

create sequence "public"."user_feeds_categories_categoryid_seq";

create sequence "public"."user_read_readid_seq";

create sequence "public"."user_to_rss_feed_pk_seq";

create sequence "public"."user_to_rss_feed_userid_seq";

create sequence "public"."users_rowid_seq";

create table "public"."articles" (
    "articleid" integer not null default nextval('articles_articleid_seq'::regclass),
    "title" character varying(500),
    "link" character varying,
    "description" text,
    "publication_date" date,
    "category" character varying(500),
    "image_link" character varying default 'default link'::character varying,
    "language" character varying(10) default 'en'::character varying
);


create table "public"."feed_articles" (
    "feedid" integer not null,
    "articleid" integer not null,
    "pk" integer not null default nextval('feed_articles_pk_seq'::regclass)
);


create table "public"."rssfeeds" (
    "rowid" integer not null default nextval('rssfeed_rowid_seq'::regclass),
    "title" character varying(150),
    "url" character varying(150) not null,
    "lastupdated" timestamp without time zone,
    "favicon" character varying(300),
    "total_articles" integer default 0
);


create table "public"."user_bookmarks" (
    "userid" integer not null,
    "articleid" integer not null,
    "bookmarkid" integer not null default nextval('user_bookmarks_bookmarkid_seq'::regclass)
);


create table "public"."user_feeds_categories" (
    "userid" integer not null,
    "feedid" integer not null,
    "category" character varying(500) not null,
    "categoryid" integer not null default nextval('user_feeds_categories_categoryid_seq'::regclass)
);


create table "public"."user_read" (
    "readid" integer not null default nextval('user_read_readid_seq'::regclass),
    "userid" integer not null,
    "articleid" integer not null
);


create table "public"."user_to_rss_feed" (
    "userid" integer not null default nextval('user_to_rss_feed_userid_seq'::regclass),
    "rssid" smallint not null,
    "pk" integer not null default nextval('user_to_rss_feed_pk_seq'::regclass)
);


create table "public"."users" (
    "rowid" integer not null default nextval('users_rowid_seq'::regclass),
    "email" character varying(55) not null,
    "password" character varying(500)
);


alter sequence "public"."articles_articleid_seq" owned by "public"."articles"."articleid";

alter sequence "public"."feed_articles_pk_seq" owned by "public"."feed_articles"."pk";

alter sequence "public"."rssfeed_rowid_seq" owned by "public"."rssfeeds"."rowid";

alter sequence "public"."user_bookmarks_bookmarkid_seq" owned by "public"."user_bookmarks"."bookmarkid";

alter sequence "public"."user_feeds_categories_categoryid_seq" owned by "public"."user_feeds_categories"."categoryid";

alter sequence "public"."user_read_readid_seq" owned by "public"."user_read"."readid";

alter sequence "public"."user_to_rss_feed_pk_seq" owned by "public"."user_to_rss_feed"."pk";

alter sequence "public"."user_to_rss_feed_userid_seq" owned by "public"."user_to_rss_feed"."userid";

alter sequence "public"."users_rowid_seq" owned by "public"."users"."rowid";

CREATE UNIQUE INDEX articles_pkey ON public.articles USING btree (articleid);

CREATE UNIQUE INDEX email_unique ON public.users USING btree (email);

CREATE UNIQUE INDEX feed_articles_pkey ON public.feed_articles USING btree (pk);

CREATE UNIQUE INDEX no_duplicate_bookmarks ON public.user_bookmarks USING btree (userid, articleid);

CREATE UNIQUE INDEX no_duplicate_feeds ON public.user_to_rss_feed USING btree (userid, rssid);

CREATE UNIQUE INDEX no_duplicate_reads ON public.user_read USING btree (userid, articleid);

CREATE UNIQUE INDEX rssfeed_pkey ON public.rssfeeds USING btree (rowid);

CREATE UNIQUE INDEX unique_article ON public.articles USING btree (link);

CREATE UNIQUE INDEX unique_user_feed_category ON public.user_feeds_categories USING btree (feedid, userid);

CREATE UNIQUE INDEX url_unique ON public.rssfeeds USING btree (url);

CREATE UNIQUE INDEX user_bookmarks_pkey ON public.user_bookmarks USING btree (bookmarkid);

CREATE UNIQUE INDEX user_feeds_categories_pkey ON public.user_feeds_categories USING btree (categoryid);

CREATE UNIQUE INDEX user_read_pkey ON public.user_read USING btree (readid);

CREATE UNIQUE INDEX user_to_rss_feed_pkey ON public.user_to_rss_feed USING btree (pk);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (rowid);

alter table "public"."articles" add constraint "articles_pkey" PRIMARY KEY using index "articles_pkey";

alter table "public"."feed_articles" add constraint "feed_articles_pkey" PRIMARY KEY using index "feed_articles_pkey";

alter table "public"."rssfeeds" add constraint "rssfeed_pkey" PRIMARY KEY using index "rssfeed_pkey";

alter table "public"."user_bookmarks" add constraint "user_bookmarks_pkey" PRIMARY KEY using index "user_bookmarks_pkey";

alter table "public"."user_feeds_categories" add constraint "user_feeds_categories_pkey" PRIMARY KEY using index "user_feeds_categories_pkey";

alter table "public"."user_read" add constraint "user_read_pkey" PRIMARY KEY using index "user_read_pkey";

alter table "public"."user_to_rss_feed" add constraint "user_to_rss_feed_pkey" PRIMARY KEY using index "user_to_rss_feed_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."articles" add constraint "unique_article" UNIQUE using index "unique_article";

alter table "public"."feed_articles" add constraint "articles_articleid" FOREIGN KEY (articleid) REFERENCES articles(articleid) NOT VALID not valid;

alter table "public"."feed_articles" validate constraint "articles_articleid";

alter table "public"."feed_articles" add constraint "rssfeeds_rowid" FOREIGN KEY (feedid) REFERENCES rssfeeds(rowid) not valid;

alter table "public"."feed_articles" validate constraint "rssfeeds_rowid";

alter table "public"."rssfeeds" add constraint "url_unique" UNIQUE using index "url_unique";

alter table "public"."user_bookmarks" add constraint "article" FOREIGN KEY (articleid) REFERENCES articles(articleid) NOT VALID not valid;

alter table "public"."user_bookmarks" validate constraint "article";

alter table "public"."user_bookmarks" add constraint "no_duplicate_bookmarks" UNIQUE using index "no_duplicate_bookmarks";

alter table "public"."user_bookmarks" add constraint "user" FOREIGN KEY (userid) REFERENCES users(rowid) NOT VALID not valid;

alter table "public"."user_bookmarks" validate constraint "user";

alter table "public"."user_feeds_categories" add constraint "feedid" FOREIGN KEY (feedid) REFERENCES rssfeeds(rowid) not valid;

alter table "public"."user_feeds_categories" validate constraint "feedid";

alter table "public"."user_feeds_categories" add constraint "unique_user_feed_category" UNIQUE using index "unique_user_feed_category";

alter table "public"."user_feeds_categories" add constraint "userid" FOREIGN KEY (userid) REFERENCES users(rowid) not valid;

alter table "public"."user_feeds_categories" validate constraint "userid";

alter table "public"."user_read" add constraint "article" FOREIGN KEY (articleid) REFERENCES articles(articleid) not valid;

alter table "public"."user_read" validate constraint "article";

alter table "public"."user_read" add constraint "no_duplicate_reads" UNIQUE using index "no_duplicate_reads";

alter table "public"."user_read" add constraint "user" FOREIGN KEY (userid) REFERENCES users(rowid) not valid;

alter table "public"."user_read" validate constraint "user";

alter table "public"."user_to_rss_feed" add constraint "no_duplicate_feeds" UNIQUE using index "no_duplicate_feeds";

alter table "public"."users" add constraint "email_format" CHECK (((email)::text ~* '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'::text)) not valid;

alter table "public"."users" validate constraint "email_format";

alter table "public"."users" add constraint "email_unique" UNIQUE using index "email_unique";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.increment_articles_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE rssfeeds
	SET total_articles = total_articles + 1
	FROM feed_articles
	WHERE feed_articles.articleid = NEW.articleid
	AND rssfeeds.rowid = feed_articles.feedid;


	RETURN NEW;
END;
$function$
;

CREATE TRIGGER articles_count_trigger AFTER INSERT ON public.feed_articles FOR EACH ROW EXECUTE FUNCTION increment_articles_count();


