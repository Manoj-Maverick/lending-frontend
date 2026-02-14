import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const PerformanceTab = ({ performance, onDownloadReport, onAddReview }) => {
  const getMetricColor = (value) => {
    if (value >= 90) return "text-success";
    if (value >= 75) return "text-warning";
    return "text-error";
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const ratingNum = parseFloat(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(ratingNum)) {
        stars.push(
          <Icon
            key={i}
            name="Star"
            size={16}
            className="fill-warning text-warning"
          />,
        );
      } else if (i - ratingNum < 1) {
        stars.push(
          <Icon
            key={i}
            name="StarHalf"
            size={16}
            className="fill-warning text-warning"
          />,
        );
      } else {
        stars.push(
          <Icon
            key={i}
            name="Star"
            size={16}
            className="text-muted-foreground"
          />,
        );
      }
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 lg:p-8">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
          Overall Performance Rating
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Rating */}
          <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-accent/5 rounded-lg">
            <div className="text-5xl md:text-6xl font-bold text-accent mb-2">
              {performance?.overallRating}
            </div>
            <div className="flex gap-1 mb-3">
              {getRatingStars(performance?.overallRating)}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Based on {performance?.totalRatings} ratings
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-semibold text-foreground mb-4">
              Key Performance Metrics
            </h4>

            {Object.entries(performance?.metrics).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <span className={`font-semibold ${getMetricColor(value)}`}>
                    {value}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      value >= 90
                        ? "bg-success"
                        : value >= 75
                          ? "bg-warning"
                          : "bg-error"
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Reviews */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border bg-muted/30">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="MessageSquare" size={20} className="text-accent" />
            Performance Reviews
          </h3>
        </div>

        <div className="divide-y divide-border">
          {performance?.reviews?.map((review, index) => (
            <div
              key={review?.id}
              className="p-4 md:p-6 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">
                      {review?.reviewer}
                    </h4>
                    <div className="flex gap-1">
                      {getRatingStars(review?.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review?.date}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-warning/10 px-3 py-1 rounded-lg">
                  <Icon
                    name="Star"
                    size={16}
                    className="fill-warning text-warning"
                  />
                  <span className="font-semibold text-warning">
                    {review?.rating}
                  </span>
                </div>
              </div>
              <p className="text-sm text-foreground">{review?.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 md:p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Icon name="Briefcase" size={24} className="text-primary" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {performance?.metrics?.clientSatisfaction || 0}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Client Satisfaction
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-3">
            <Icon name="Target" size={24} className="text-success" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {performance?.metrics?.targetAchievement || 0}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Target Achievement
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Icon name="Users" size={24} className="text-accent" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {performance?.metrics?.teamLeadership || 0}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">Team Leadership</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-3">
            <Icon name="TrendingUp" size={24} className="text-warning" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {performance?.metrics?.loanProcessing || 0}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Loan Processing Efficiency
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          iconName="FileText"
          iconPosition="left"
          onClick={() => onDownloadReport?.()}
        >
          Download Report
        </Button>
        <Button
          variant="outline"
          iconName="MessageSquare"
          iconPosition="left"
          onClick={() => onAddReview?.()}
        >
          Add Review
        </Button>
      </div>
    </div>
  );
};

export default PerformanceTab;
