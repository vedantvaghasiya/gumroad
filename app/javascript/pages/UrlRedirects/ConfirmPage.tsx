import { useForm, usePage } from "@inertiajs/react";
import * as React from "react";

import { Button } from "$app/components/Button";
import { Layout, type LayoutProps } from "$app/components/server-components/DownloadPage/Layout";
import { Placeholder } from "$app/components/ui/Placeholder";

type ConfirmationInfo = {
  id: string;
  destination: string | null;
  display: string | null;
  email: string | null;
};

type PageProps = LayoutProps & {
  confirmation_info: ConfirmationInfo;
};

function ConfirmPage() {
  const props = usePage<PageProps>().props;
  const { confirmation_info } = props;
  const form = useForm({
    id: confirmation_info.id,
    destination: confirmation_info.destination ?? "",
    display: confirmation_info.display ?? "",
    email: confirmation_info.email ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post(Routes.confirm_redirect_path());
  };

  return (
    <Layout {...props} className="flex-1">
      <Placeholder className="flex-1">
        <h2>You've viewed this product a few times already</h2>
        <p>Once you enter the email address used to purchase this product, you'll be able to access it again.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ width: "calc(min(428px, 100%))" }}>
          <input
            type="text"
            name="email"
            placeholder="Email address"
            value={form.data.email}
            onChange={(e) => form.setData("email", e.target.value)}
          />
          <Button type="submit" color="accent" disabled={form.processing}>
            {form.processing ? "Confirming..." : "Confirm email"}
          </Button>
        </form>
      </Placeholder>
    </Layout>
  );
}

ConfirmPage.loggedInUserLayout = true;
export default ConfirmPage;
