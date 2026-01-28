import { useForm, usePage } from "@inertiajs/react";
import * as React from "react";

import { Button } from "$app/components/Button";
import { Placeholder } from "$app/components/ui/Placeholder";
import { AuthenticationLayout } from "$app/inertia/layout";

type ConfirmationInfo = {
  id: string;
  destination: string | null;
  display: string | null;
  email: string | null;
};

type PageProps = {
  confirmation_info: ConfirmationInfo;
};

function ConfirmPage() {
  const { confirmation_info } = usePage<PageProps>().props;
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
    <AuthenticationLayout>
      <Placeholder>
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
    </AuthenticationLayout>
  );
}

ConfirmPage.disableLayout = true;
export default ConfirmPage;
