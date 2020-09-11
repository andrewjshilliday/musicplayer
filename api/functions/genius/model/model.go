package model

type Exception struct {
	Message string `json:"message"`
}

type Response struct {
	Response struct {
		Artist     *Artist     `json:"artist,omitempty"`
		Song       *Song       `json:"song,omitempty"`
		Annotation *Annotation `json:"annotation,omitempty"`
		User       *User       `json:"user,omitempty"`
		Songs      []*Song     `json:"songs,omitempty"`
		NextPage   int         `json:"next_page,omitempty"`
		Hits       []*Hit      `json:"hits,omitempty"`
		WebPage    *WebPage    `json:"web_page,omitempty"`
	} `json:"response"`
}

type Annotation struct {
	ApiPath       string   `json:"api_path"`
	CommentCount  int      `json:"comment_count"`
	Community     bool     `json:"community"`
	CustomPreview string   `json:"custom_preview"`
	HasVoters     bool     `json:"has_voters"`
	ID            int      `json:"id"`
	Pinned        bool     `json:"pinned"`
	ShareURL      string   `json:"share_url"`
	Source        string   `json:"source"`
	State         string   `json:"state"`
	URL           string   `json:"url"`
	Verified      bool     `json:"verified"`
	VotesTotal    int      `json:"voters_total"`
	CosignedBy    []string `json:"cosigned_by"`
	VerifiedBy    *User    `json:"verified_by"`
}

type Author struct {
	Attribution float64 `json:"attribution"`
	PinnedRole  string  `json:"pinned_role"`
	User        *User   `json:"user"`
}

type DescriptionAnnotation struct {
	Type                 string        `json:"_type"`
	AnnotatorID          int           `json:"annotator_id"`
	AnnotatorLogin       string        `json:"annotator_login"`
	ApiPath              string        `json:"api_path"`
	Classification       string        `json:"classification"`
	Fragment             string        `json:"fragment"`
	ID                   int           `json:"id"`
	IsDescription        bool          `json:"is_description"`
	Path                 string        `json:"path"`
	SongID               int           `json:"song_id"`
	URL                  string        `json:"url"`
	VerifiedAnnotatorIDs []int         `json:"verified_annotator_ids"`
	Annotatable          *Annotatable  `json:"annotatable"`
	Annotations          []*Annotation `json:"annotations"`

	Range struct {
		Content string `json:"content"`
	} `json:"range"`
}

type Annotatable struct {
	ApiPath   string `json:"api_path"`
	Context   string `json:"context"`
	ID        int    `json:"id"`
	ImageURL  string `json:"image_url"`
	LinkTitle string `json:"link_title"`
	Title     string `json:"title"`
	Type      string `json:"type"`
	URL       string `json:"url"`
}

type UserMetadata struct {
	Permissions          []string    `json:"permissions"`
	ExcludedPersmissions []string    `json:"excluded_permissions"`
	Features             []string    `json:"features"`
	IQByAction           *IQByAction `json:"iq_by_action"`

	Interactions struct {
		Following bool `json:"following"`
		Cosign    bool `json:"cosign"`
		Pyong     bool `json:"pyong"`
		Vote      bool `json:"vote"`
	} `json:"interactions"`

	Relationships struct {
		PinnedRole string `json:"pinned_role"`
	} `json:"relationships"`
}

type IQByAction struct {
	Accept struct {
		Primary *Primary `json:"primary"`
	} `json:"accept"`
	Reject struct {
		Primary *Primary `json:"primary"`
	} `json:"reject"`
	Delete struct {
		Primary *Primary `json:"primary"`
	} `json:"delete"`
	EditMetadata struct {
		Primary *Primary `json:"primary"`
	} `json:"edit_metadata"`
}

type Primary struct {
	Multiplier int     `json:"multiplier"`
	Base       float64 `json:"base"`
	Applicable bool    `json:"applicable"`
}

type User struct {
	ApiPath                     string        `json:"api_path"`
	Avatar                      *Avatar       `json:"avatar"`
	HeaderImageURL              string        `json:"header_image_url"`
	HumanReadableRoleForDisplay string        `json:"human_readable_role_for_display"`
	ID                          int           `json:"id"`
	IQ                          int           `json:"iq"`
	Login                       string        `json:"login"`
	Name                        string        `json:"name"`
	RoleForDisplay              string        `json:"role_for_display"`
	URL                         string        `json:"url"`
	CurrentUserMetadata         *UserMetadata `json:"current_user_metadata"`
}

type Avatar struct {
	Tiny   *Image `json:"tiny"`
	Thumb  *Image `json:"thumb"`
	Small  *Image `json:"small"`
	Medium *Image `json:"medium"`
}

type Image struct {
	URL         string `json:"url"`
	BoundingBox struct {
		Width  int `json:"width"`
		Height int `json:"height"`
	} `json:"bounding_box"`
}

type FactTrack struct {
	Provider     string `json:"provider"`
	ExternalURL  string `json:"external_url"`
	ButtonText   string `json:"button_text"`
	HelpLinkText string `json:"help_link_text"`
	HelpLinkURL  string `json:"help_link_url"`
}

type Stats struct {
	AcceptedAnnotations   int  `json:"accepted_annotations"`
	Contributors          int  `json:"contributors"`
	Hot                   bool `json:"hot"`
	IQEarners             int  `json:"iq_earners"`
	Transcribers          int  `json:"transcribers"`
	UnreviewedAnnotations int  `json:"unreviewed_annotations"`
	VerifiedAnnotations   int  `json:"verified_annotations"`
	Concurrents           int  `json:"concurrents"`
	Pageviews             int  `json:"pageviews"`
}

type Album struct {
	ApiPath     string  `json:"api_path"`
	CoverArtURL string  `json:"cover_art_url"`
	FullTitle   string  `json:"full_title"`
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	URL         string  `json:"url"`
	Artist      *Artist `json:"artist"`
}

type Song struct {
	AnnotationCount          int        `json:"annotation_count"`
	ApiPath                  string     `json:"api_path"`
	EmbedContent             string     `json:"embed_content"`
	FactTrack                *FactTrack `json:"fact_track"`
	FeaturedVideo            bool       `json:"features_video"`
	FullTitle                string     `json:"full_title"`
	HeaderImageThumbnailURL  string     `json:"header_image_thumbnail_url"`
	HeaderImageURL           string     `json:"header_image_url"`
	ID                       int        `json:"id"`
	Lyrics                   string     `json:"lyrics"`
	LyricsOwnerID            int        `json:"lyrics_owner_id"`
	LyricsState              string     `json:"lyrics_state"`
	Path                     string     `json:"path"`
	PyongsCount              int        `json:"pyong_count"`
	RecordingLocation        string     `json:"recording_location"`
	ReleaseDate              string     `json:"release_date"`
	SongArtImageThumbnailURL string     `json:"song_art_image_thumbnail_url"`
	SongArtImageURL          string     `json:"song_art_image_url"`
	Stats                    *Stats     `json:"stats"`
	Title                    string     `json:"title"`
	TitleWithFeatured        string     `json:"title_with_featured"`
	URL                      string     `json:"url"`
	/* CurrentUserMetadata      *UserMetadata          `json:"current_user_metadata"` */
	Album                 *Album                 `json:"album"`
	DescriptionAnnotation *DescriptionAnnotation `json:"description_annotation"`
	FeaturedArtists       []*Artist              `json:"featured_artist"`
	Media                 []*Media               `json:"media"`
	PrimaryArtist         *Artist                `json:"primary_artist"`
	ProducerArtists       []*Artist              `json:"producer_artists"`
	SongRelationships     []*SongRelationship    `json:"song_relationships"`
	/* VerifiedAnnotationsBy    []*User                `json:"verified_annotations_by"`
	VerifiedContributors     []*Contributor         `json:"verified_contributors"`
	VerifiedLyricsBy         []*User                `json:"verified_lyrics_by"` */
	WriterArtists []*Artist `json:"writer_artists"`
}

type Contributor struct {
	Contributions []string `json:"contributions"`
	Artist        *Artist  `json:"artist"`
	User          *User    `json:"user"`
}

type SongRelationship struct {
	Type  string  `json:"type"`
	Songs []*Song `json:"songs"`
}

type WebPage struct {
	ApiPath         string `json:"api_path"`
	Domain          string `json:"domain"`
	ID              int    `json:"id"`
	NormalizedURL   string `json:"normalized_url"`
	ShareURL        string `json:"share_url"`
	Title           string `json:"title"`
	URL             string `json:"url"`
	AnnotationCount int    `json:"annotation_count"`
}

type Media struct {
	Provider   string `json:"provider"`
	ProviderID string `json:"provider_id"`
	NativeURI  string `json:"native_uri"`
	Start      int    `json:"start"`
	Type       string `json:"type"`
	URL        string `json:"url"`
}

type Artist struct {
	AlternateNames        []string               `json:"alternate_names"`
	ApiPath               string                 `json:"api_path"`
	FacebookName          string                 `json:"facebook_name"`
	FollowersCount        int                    `json:"followers_count"`
	HeaderImageURL        string                 `json:"header_image_url"`
	ID                    int                    `json:"id"`
	ImageURL              string                 `json:"image_url"`
	InstagramName         string                 `json:"instagram_name"`
	IsMemeVerified        bool                   `json:"is_meme_verified"`
	IsVerified            bool                   `json:"is_verified"`
	Name                  string                 `json:"name"`
	TwitterName           string                 `json:"twitter_name"`
	URL                   string                 `json:"url"`
	CurrentUserMetadata   *UserMetadata          `json:"current_user_metadata"`
	IQ                    int                    `json:"iq"`
	DescriptionAnnotation *DescriptionAnnotation `json:"description_annotation"`
	User                  *User                  `json:"user"`
}

type Hit struct {
	Highlights []string `json:"highlights"`
	Index      string   `json:"index"`
	Type       string   `json:"type"`
	Result     *Song    `json:"result"`
}
