type FAQ = {
  question: string;
  answer: string;
};

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="bg-[#16161a] p-4 rounded-xl"
          >
            <summary className="font-semibold text-lg cursor-pointer">
              {faq.question}
            </summary>
            <p className="mt-2 text-gray-300">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
