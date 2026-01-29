# frozen_string_literal: true

class GumroadBlog::PostsController < GumroadBlog::BaseController
  layout "inertia"

  before_action :set_blog_owner!
  before_action :set_post, only: [:show]

  after_action :verify_authorized

  def index
    authorize [:gumroad_blog, :posts]

    set_meta_tag(title: "Blog")
    set_meta_tag(property: "og:title", value: "Gumroad Blog")
    set_meta_tag(property: "og:description", value: "Tips and tactics to grow the way you want.")

    posts = @blog_owner.installments
      .visible_on_profile
      .order(published_at: :desc)

    render inertia: "GumroadBlog/Index", props: {
      posts: posts.map do |post|
        {
          url: gumroad_blog_post_path(post.slug),
          subject: post.subject,
          published_at: post.published_at,
          featured_image_url: post.featured_image_url,
          message_snippet: post.message_snippet,
          tags: post.tags,
        }
      end,
    }
  end

  def show
    authorize @post, policy_class: GumroadBlog::PostsPolicy

    set_meta_tag(title: @post.subject)
    set_meta_tag(property: "og:title", value: @post.subject)
    set_meta_tag(property: "og:description", value: @post.message_snippet)

    render inertia: "GumroadBlog/Show", props: PostPresenter.new(pundit_user: pundit_user, post: @post, purchase_id_param: nil).post_component_props
  end

  private
    def set_post
      @post = @blog_owner.installments.find_by!(slug: params[:slug])
    end
end
